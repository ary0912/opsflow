import prisma from "./lib/prisma"

async function test() {
  try {
    const task = await prisma.task.create({
      data: {
        title: "Test Task",
        status: "todo",
        priority: "medium",
        userId: "public",
      }
    })
    console.log("Task Success:", task)
  } catch (err) {
    console.error("Error creating task:", err)
  }

  try {
    const workflow = await prisma.workflow.create({
      data: {
        name: "Test Workflow",
        trigger: "task_created",
        actions: [],
        userId: "public",
      }
    })
    console.log("Workflow Success:", workflow)
  } catch (err) {
    console.error("Error creating workflow:", err)
  }
}

test()
