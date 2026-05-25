-- Tabla de saldo de Yankis por usuario
CREATE TABLE IF NOT EXISTS yankis_balance (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance      INTEGER DEFAULT 0 CHECK (balance >= 0),
  total_earned INTEGER DEFAULT 0,
  total_spent  INTEGER DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de transacciones de Yankis (historial completo)
CREATE TABLE IF NOT EXISTS yankis_transactions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type          TEXT CHECK (type IN ('earned', 'spent', 'purchased', 'refunded', 'bonus')),
  amount        INTEGER NOT NULL CHECK (amount > 0),
  balance_after INTEGER NOT NULL,
  description   TEXT,
  exchange_id   UUID REFERENCES exchange_requests(id) ON DELETE SET NULL,
  payment_id    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE yankis_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE yankis_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own balance"
  ON yankis_balance FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users see own transactions"
  ON yankis_transactions FOR SELECT USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_yankis_tx_user ON yankis_transactions(user_id, created_at DESC);

-- Función para acreditar Yankis (SECURITY DEFINER — solo llamar desde server side)
CREATE OR REPLACE FUNCTION credit_yankis(
  p_user_id    UUID,
  p_amount     INTEGER,
  p_type       TEXT,
  p_description TEXT,
  p_exchange_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  INSERT INTO yankis_balance (user_id, balance, total_earned)
  VALUES (
    p_user_id,
    p_amount,
    CASE WHEN p_type != 'spent' THEN p_amount ELSE 0 END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    balance      = yankis_balance.balance + p_amount,
    total_earned = yankis_balance.total_earned + CASE WHEN p_type != 'spent' THEN p_amount ELSE 0 END,
    updated_at   = NOW()
  RETURNING balance INTO v_new_balance;

  INSERT INTO yankis_transactions (user_id, type, amount, balance_after, description, exchange_id)
  VALUES (p_user_id, p_type, p_amount, v_new_balance, p_description, p_exchange_id);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para debitar Yankis (con validación de saldo)
CREATE OR REPLACE FUNCTION debit_yankis(
  p_user_id     UUID,
  p_amount      INTEGER,
  p_description TEXT,
  p_exchange_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance     INTEGER;
BEGIN
  SELECT balance INTO v_current_balance
  FROM yankis_balance WHERE user_id = p_user_id FOR UPDATE;

  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Saldo insuficiente de Yankis: tienes %, necesitas %',
      COALESCE(v_current_balance, 0), p_amount;
  END IF;

  UPDATE yankis_balance SET
    balance     = balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at  = NOW()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;

  INSERT INTO yankis_transactions (user_id, type, amount, balance_after, description, exchange_id)
  VALUES (p_user_id, 'spent', p_amount, v_new_balance, p_description, p_exchange_id);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
