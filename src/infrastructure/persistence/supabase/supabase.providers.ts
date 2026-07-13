import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_ADMIN_CLIENT,
  SUPABASE_PUBLIC_CLIENT,
} from './supabase.tokens';

function getRequiredConfig(config: ConfigService, key: string): string {
  const value = config.get<string>(key);

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const supabaseProviders: Provider[] = [
  {
    provide: SUPABASE_PUBLIC_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const supabaseUrl = getRequiredConfig(config, 'SUPABASE_URL');
      const supabaseAnonKey = getRequiredConfig(config, 'SUPABASE_ANON_KEY');

      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    },
  },
  {
    provide: SUPABASE_ADMIN_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const supabaseUrl = getRequiredConfig(config, 'SUPABASE_URL');
      const supabaseServiceRoleKey = getRequiredConfig(
        config,
        'SUPABASE_SERVICE_ROLE_KEY',
      );

      return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    },
  },
];
