import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="mb-12 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            ВСТУПИТЕ В САМОЕ БОЛЬШОЕ СООБЩЕСТВО ЭКСПЕРТОВ, БЛОГЕРОВ, ПРОДЮСЕРОВ В СНГ
          </h2>
          <Button
            className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-2 rounded-md transition-colors"
            disabled
          >
            ВСТУПИТЬ В СООБЩЕСТВО
          </Button>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Categories Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Вид категорий</h4>
            <ul className="grid grid-cols-2 gap-2">
              <li>
                <Link href="library/?category=Business" className="text-gray-400 hover:text-white transition-colors">
                  Бизнес
                </Link>
              </li>
              <li>
                <Link href="library/?category=Health" className="text-gray-400 hover:text-white transition-colors">
                  Здоровье
                </Link>
              </li>
              <li>
                <Link href="library/?category=Sports" className="text-gray-400 hover:text-white transition-colors">
                  Спорт
                </Link>
              </li>
              <li>
                <Link href="library/?category=Beauty" className="text-gray-400 hover:text-white transition-colors">
                  Красота
                </Link>
              </li>
              <li>
                <Link href="library/?category=Clothing" className="text-gray-400 hover:text-white transition-colors">
                  Одежда
                </Link>
              </li>
              <li>
                <Link href="library/?category=Care" className="text-gray-400 hover:text-white transition-colors">
                  Уход
                </Link>
              </li>
              <li>
                <Link
                  href="library/?category=Entertainment"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Развлечения
                </Link>
              </li>
              <li>
                <Link href="library/?category=Travel" className="text-gray-400 hover:text-white transition-colors">
                  Путешествия
                </Link>
              </li>
              <li>
                <Link href="library/?category=AI" className="text-gray-400 hover:text-white transition-colors">
                  ИИ
                </Link>
              </li>
              <li>
                <Link href="library/?category=Psychology" className="text-gray-400 hover:text-white transition-colors">
                  Психология
                </Link>
              </li>
              <li>
                <Link href="library/?category=Science" className="text-gray-400 hover:text-white transition-colors">
                  Наука
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Социальная Сеть</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.instagram.com/starmake.ai"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" /> Instagram
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Техническая поддержка</h4>
            <Link
              href="mailto:support@starmake.ai"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" /> support@starmake.ai
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-gray-800 text-center text-gray-500">
          © 2024 StarMake. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

