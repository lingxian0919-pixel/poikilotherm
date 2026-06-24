import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Supabase 환경 변수가 설정되지 않았습니다.\n' +
    '.env.local 파일에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정해 주세요.\n' +
    '참고: .env.local.example 파일을 확인하세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Submission = {
  id: string;
  student_id: string;
  student_name: string;
  subject: string;
  content: string;
  self_score: number; // 1~5
  teacher_score: number | null; // 0~100
  feedback: string | null;
  created_at: string;
  updated_at: string;
};
