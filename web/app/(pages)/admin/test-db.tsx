'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

type TestDbResult =
  | {
      success: true;
      message: string;
      insertedData: unknown;
    }
  | {
      success: false;
      error: string;
      details: unknown;
    };

export default function TestDBPage() {
  const [result, setResult] = useState<TestDbResult | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const testConnection = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Test 1: Check if table exists
      const { data: tables, error: tablesError } = await supabase
        .from('admin_questions')
        .select('*')
        .limit(1);

      if (tablesError) {
        setResult({
          success: false,
          error: 'Table access error',
          details: {
            message: tablesError.message,
            details: tablesError.details,
            hint: tablesError.hint,
            code: tablesError.code,
          },
        });
        return;
      }

      // Test 2: Try to insert
      const testQuestion = {
        category: 'B',
        test_number: 1,
        question_text: 'Test question - will be deleted',
        option_a: 'Test A',
        option_b: 'Test B',
        option_c: 'Test C',
        correct_answer: 'A',
      };

      const { data: insertData, error: insertError } = await supabase
        .from('admin_questions')
        .insert([testQuestion])
        .select()
        .single();

      if (insertError) {
        setResult({
          success: false,
          error: 'Insert error',
          details: {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
          },
        });
        return;
      }

      // Test 3: Delete the test question
      if (insertData) {
        await supabase
          .from('admin_questions')
          .delete()
          .eq('id', insertData.id);
      }

      setResult({
        success: true,
        message: 'All tests passed! Database is working correctly.',
        insertedData: insertData,
      });
    } catch (error: unknown) {
      const details = error instanceof Error ? error.message : String(error);
      setResult({
        success: false,
        error: 'Unexpected error',
        details,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Database Connection Test</h1>
        
        <GlassCard className="p-6 border border-border/80 bg-black/80">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testing...' : 'Test Database Connection'}
          </Button>
        </GlassCard>

        {result && (
          <GlassCard className="p-6 border border-border/80 bg-black/80">
            <h2 className="text-xl font-semibold mb-4">
              {result.success ? '✅ Success' : '❌ Error'}
            </h2>
            
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>

            {!result.success && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-semibold text-destructive mb-2">What to do:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Copy the error details above</li>
                  <li>Run <code className="bg-muted px-1 rounded">fix_admin_questions_v2.sql</code> in Supabase</li>
                  <li>Refresh this page and test again</li>
                </ol>
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
}
