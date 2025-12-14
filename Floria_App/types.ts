export type Country = {
  id: number;
  created_at: string | null;
  name: string;
  continent: string;
  flag_url: string | null;
  capital?: string | null;
  population?: number | null;
  currency?: string | null;
  abbreviation?: string | null;
};
