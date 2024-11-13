import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // プロジェクトの取得
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (projectError) throw projectError

    // タスクの取得
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*, sub_tasks(*)')
      .eq('project_id', params.id)

    if (tasksError) throw tasksError

    // メモの取得
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .eq('project_id', params.id)

    if (notesError) throw notesError

    // ファイルの取得
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', params.id)

    if (filesError) throw filesError

    return NextResponse.json({
      ...project,
      tasks: tasks || [],
      notes: notes || [],
      files: files || [],
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
