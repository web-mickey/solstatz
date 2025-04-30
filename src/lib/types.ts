export type TokenCategory = {
  category: string;
  token_count: number;
  percentage: string;
};

export type TotalTokensTraded = {
  total_tokens: number;
};

export type Token10k = {
  token_address: string;
  x: number;
};

export type TopSandwich = {
  date: string;
  token_address: string;
  wallet_address: string;
  sol_earn: number;
  tx_hashes_in_window: string[];
  slot: number;
  victim_wallet_address: string;
  victim_amount_in: number;
  victim_tx_hash: string;
};

export type TotalSolDrainedPump = {
  date: string;
  tx_count: number;
  sol_drained: number;
};

export type TopSandwichers = {
  wallet_address: string;
  tx_count: number;
  sol_drained: number;
};

export type TotalSolDrainedRaydium = {
  date: string;
  tx_count: number;
  sol_drained: number;
};

export type TopTrade = {
  token_address: string;
  wallet_address: string;
  pnl_percentage: number;
  total_sol_buy: number;
  total_sol_sell: number;
  count_buy: number;
  count_sell: number;
};

export type DayData = {
  date: string;
  total_tokens_traded: TotalTokensTraded[];
  token_category: TokenCategory[];
  tokens_10k: Token10k[];
  top_sandwich_pump: TopSandwich[];
  top_sandwich_raydium: TopSandwich[];
  top_sandwich_pumpswap?: TopSandwich[];
  top_sandwichers_pump: TopSandwichers[];
  top_sandwichers_raydium: TopSandwichers[];
  top_sandwichers_pumpswap?: TopSandwichers[];
  total_sol_drained_pump: TotalSolDrainedPump[];
  total_sol_drained_raydium: TotalSolDrainedRaydium[];
  total_sol_drained_pumpswap?: TotalSolDrainedPump[];
  top_trades: TopTrade[];
};

export enum MevStatsType {
  Raydium = "raydium",
  Pump = "pump",
  All = "all",
}

export type PumpFunApiToken = {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  video_uri: string | null;
  metadata_uri: string;
  twitter: string | null;
  telegram: string | null;
  bonding_curve: string | null;
  associated_bonding_curve: string | null;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website: string | null;
  show_name: boolean;
  king_of_the_hill_timestamp: number | null;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_id: string | null;
  inverted: string | null;
  is_currently_live: boolean;
  username: string | null;
  profile_image: string | null;
  usd_market_cap: number;
};

export type LiveMev = {
  date: string;
  token_address: string;
  wallet_address: string;
  sol_drained: number;
  tx_hash_buy: string;
  tx_hash_sell: string;
  victim_wallet_address: string;
  victim_amount_in: number;
  victim_tx_hash: string;
  slot: number;
  timestamp: string;
  source: "raydium" | "pump" | "pumpswap";
  lp: string;
  is_new: boolean;
};

export type ValidatorInfo = {
  network: string;
  account: string;
  name: string | null;
  keybase_id: string | null;
  www_url: string | null;
  details: string | null;
  avatar_url: string | null;
  avatar_file_url?: string; // optional, not always present
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  admin_warning: string | null;
  jito: boolean;
  jito_commission: number | null;
  stake_pools_list: string[];
  is_active: boolean;
  active_stake: number | null;
  authorized_withdrawer_score: number;
  commission: number | null;
  data_center_concentration_score: number;
  delinquent: boolean | null;
  published_information_score: number;
  root_distance_score: number;
  security_report_score: number;
  skipped_slot_score: number;
  skipped_after_score: number;
  software_version: string;
  software_version_score: number;
  stake_concentration_score: number;
  consensus_mods_score: number;
  vote_latency_score: number | null;
  total_score: number;
  vote_distance_score: number;
  ip: string;
  data_center_key: string;
  autonomous_system_number: number;
  latitude: string | null;
  longitude: string | null;
  data_center_host: string | null;
  vote_account: string;
  epoch_credits?: number; // optional
  epoch?: number; // optional
  skipped_slots?: number; // optional
  skipped_slot_percent?: string; // optional
  ping_time?: number | null; // sometimes null or missing
  url: string;
};

// Aggregated Mev Data
export type VictimPrivMempoolProvider = {
  victim_priv_mempool_provider: string | null;
  tx_count: number;
  victim_real_sol_extracted: number;
  victim_tip: number;
  attacker_sell_tip: number;
  attacker_buy_tip: number;
  attacker_sell_tx_fee: number;
  attacker_buy_tx_fee: number;
  attacker_priv_mempool_count: number;
};

export type DfAggSource = {
  source: string;
  tx_count: number;
  victim_real_sol_extracted: number;
  attacker_sol_extracted_new: number;
  protocol_fee_earned: number;
  lp_fee_earned: number;
  attacker_tip: number;
  attacker_sell_tip: number;
  attacker_buy_tip: number;
  attacker_tx_fee: number;
  attacker_sell_tx_fee: number;
  attacker_buy_tx_fee: number;
};

export type LpRecord = {
  lp: string;
  tx_count: number;
  victim_real_sol_extracted: number;
};

export type TokenAddressTx = {
  token_address: string;
  tx_count: number;
  victim_real_sol_extracted: number;
};

export type AttackerWalletAddressTx = {
  attacker_address: string;
  tx_count: number;
  victim_real_sol_extracted: number;
};

export type VictimWalletAddressTx = {
  victim_wallet_address: string;
  tx_count: number;
  victim_real_sol_extracted: number;
};

export type ValidatorRecord = {
  validator: string;
  tx_count: number;
  victim_real_sol_extracted: number;
};

export type TopAttackRecord = {
  date: string;
  token_address: string;
  attacker_address: string;
  attacker_sol_extracted: number;
  victim_real_sol_extracted: number;
  victim_priv_mempool_provider: string | null;
  attacker_tx_hash_buy: string;
  attacker_tx_hash_sell: string;
  slot: number;
  victim_wallet_address: string;
  victim_amount_in: number;
  victim_tx_hash: string;
};

export type AggregatedMevData = {
  date: string;
  agg_victim_priv_mempool_provider: VictimPrivMempoolProvider[];
  df_agg_source: DfAggSource[];
  top_lp_tx: LpRecord[];
  top_lp_extracted: LpRecord[];
  top_token_address_tx: TokenAddressTx[];
  top_token_address_extracted: TokenAddressTx[];
  top_attacker_address_tx: AttackerWalletAddressTx[];
  top_attacker_address_extracted: AttackerWalletAddressTx[];
  top_victim_wallet_address_tx: VictimWalletAddressTx[];
  top_victim_wallet_address_extracted: VictimWalletAddressTx[];
  top_validator_tx: ValidatorRecord[];
  top_validator_extracted: ValidatorRecord[];
  top_attacks: TopAttackRecord[];
};
