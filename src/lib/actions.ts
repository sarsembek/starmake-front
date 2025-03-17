"use server"

export async function generateResponse(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const userMessage = formData.get("user_message") as string

  console.log("Generating response for user message:", userMessage)

  // Mock response based on user message
  return {
    idea: "История о том, как автосервис адаптировался к работе во время карантина",
    script:
      "В разгар пандемии наш автосервис столкнулся с беспрецедентными вызовами. Мы быстро адаптировались: внедрили бесконтактную приемку автомобилей, запустили онлайн-консультации и мобильный сервис. Это позволило нам не только выжить, но и привлечь новых клиентов.",
    tags: "#автосервис #пандемия #адаптация #бизнес",
  }
}

export async function submitScenario(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const scenarioText = formData.get("scenario_text") as string

  // In a real app, you would save this to a database
  console.log("Saving scenario:", scenarioText)

  return { success: true }
}

export async function submitTemplate(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const loudStart = formData.get("loud_start") as string
  const textAmplifier = formData.get("text_amplifier") as string
  const mainText = formData.get("main_text") as string
  const callToAction = formData.get("call_to_action") as string

  // Validate all fields are filled
  if (!loudStart || !textAmplifier || !mainText || !callToAction) {
    return { success: false, message: "Пожалуйста, заполните все поля" }
  }

  // In a real app, you would save this to a database
  console.log("Saving template:", { loudStart, textAmplifier, mainText, callToAction })

  return { success: true }
}

