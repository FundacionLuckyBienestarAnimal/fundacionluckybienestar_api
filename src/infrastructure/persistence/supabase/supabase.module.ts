import { Module } from '@nestjs/common';
import { supabaseProviders } from './supabase.providers';

@Module({
  providers: [...supabaseProviders],
  exports: [...supabaseProviders],
})
export class SupabaseModule {}
