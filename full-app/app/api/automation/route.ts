import { NextRequest, NextResponse } from 'next/server'
import {
  backupDatabase,
  checkInventoryAlerts,
  processPendingOrders,
  generateAnalyticsReport,
  cleanupCache,
  healthCheck,
  syncProducts,
  runAllAutomationTasks,
} from '@/automation/tasks'

// GET /api/automation - Run specific task
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const task = searchParams.get('task')
  const runAll = searchParams.get('all') === 'true'

  try {
    // Run all tasks
    if (runAll) {
      const results = await runAllAutomationTasks()
      return NextResponse.json({
        success: true,
        message: 'All automation tasks completed',
        results,
      })
    }

    // Run specific task
    let result
    switch (task) {
      case 'backup':
        result = await backupDatabase()
        break
      case 'inventory':
        result = await checkInventoryAlerts()
        break
      case 'orders':
        result = await processPendingOrders()
        break
      case 'analytics':
        result = await generateAnalyticsReport()
        break
      case 'cleanup':
        result = await cleanupCache()
        break
      case 'health':
        result = await healthCheck()
        break
      case 'sync':
        result = await syncProducts()
        break
      default:
        return NextResponse.json(
          { error: 'Task not found. Available: backup, inventory, orders, analytics, cleanup, health, sync, all' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      task,
      result,
    })
  } catch (error: any) {
    console.error('Automation error:', error)
    return NextResponse.json(
      { error: 'Automation task failed', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/automation - Run custom automation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { task, params } = body

    // Run all tasks
    if (task === 'all') {
      const results = await runAllAutomationTasks()
      return NextResponse.json({
        success: true,
        message: 'All automation tasks completed',
        results,
      })
    }

    // Run specific task with params
    let result
    switch (task) {
      case 'backup':
        result = await backupDatabase()
        break
      case 'inventory':
        result = await checkInventoryAlerts()
        break
      case 'orders':
        result = await processPendingOrders()
        break
      case 'analytics':
        result = await generateAnalyticsReport()
        break
      case 'cleanup':
        result = await cleanupCache()
        break
      case 'health':
        result = await healthCheck()
        break
      case 'sync':
        result = await syncProducts()
        break
      default:
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      task,
      result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Automation failed', details: error.message },
      { status: 500 }
    )
  }
}
