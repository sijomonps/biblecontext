import { BookOpen, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 mt-16">
      <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="panel panel-grid panel-outline px-6 py-8 flex flex-col items-center text-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground/90">
              BibleContext
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
              One-line chapter context for every book of the Holy Bible, crafted for beginners in English and Malayalam.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-2">
            <span>Made by Sijomon P S</span>
            <Heart className="w-3 h-3 text-primary" />
            <span>for thoughtful reading</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
