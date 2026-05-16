'use client'

import { useState } from 'react'
import { Yuji_Syuku } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const yuji = Yuji_Syuku({ 
  weight: '400',
  subsets: ['latin'], // 英語や数字も含めるための設定
})

// ★Step 3-1: カテゴリのデータを定義
const CATEGORIES = [
  { id: 'recommend', label: 'おすすめ' },
  { id: 'regular', label: 'レギュラー' },
  { id: 'side', label: 'サイド' },
  { id: 'drink', label: 'ドリンク' },
  { id: 'dessert', label: 'デザート' },
]

// ★Step 3-2: 各カテゴリのメニューデータを定義
const MENU_DATA = {
  recommend: [
    { id: 1, name: '店長特製 豚の角煮', price: 1200 },
    { id: 2, name: '季節の天ぷら盛り合わせ', price: 950 },
  ],
  regular: [
    { id: 3, name: '醤油ラーメン', price: 850 },
    { id: 4, name: '特製チャーハン', price: 700 },
  ],
  side: [
    { id: 5, name: '自家製焼き餃子', price: 400 },
    { id: 6, name: '若鶏の唐揚げ', price: 500 },
  ],
  drink: [
    { id: 7, name: '生ビール (中)', price: 600 },
    { id: 8, name: 'ウーロン茶', price: 300 },
  ],
  dessert: [
    { id: 9, name: '濃厚抹茶アイス', price: 350 },
  ],
}


export default function Home() {
  // ★Step 2: 今選ばれているカテゴリを記憶する（初期値は 'recommend'）
  const [activeTab, setActiveTab] = useState('recommend')

  // 現在選ばれているカテゴリのメニュー一覧を取得
  // （TypeScriptの警告が出ないよう as keyof typeof MENU_DATA を付けています）
  const currentMenus = MENU_DATA[activeTab as keyof typeof MENU_DATA]
  // 現在選ばれているカテゴリの名前を取得
  const currentCategoryLabel = CATEGORIES.find(c => c.id === activeTab)?.label

  return (
    // min-h-screen で画面全体の高さを確保。bg-gray-50 で背景をわずかにグレーにしてカードを目立たせる
    // pb-24 は下部に固定する「注文ボタン」でコンテンツが隠れないようにするための余白です
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      
      {/* 1. ヘッダー領域（店舗名） */}
      {/* sticky top-0 で画面上部に固定 */}
      <header className="sticky top-0 z-10 bg-orange-400 border-b px-4 py-3 text-center shadow-sm">
        <h1 className={`text-2xl font-bold text-white tracking-widest ${yuji.className}`}>OSAKI 亭</h1>
      </header>

      {/* 2. メイン領域（メニュー表示エリア） */}
{/* ★Step 4: flex を使って左サイドバーと右メインエリアを横並びにする */}
      <main className="flex items-start">
        
        {/* 左側：カテゴリ選択サイドバー */}
        {/* w-24(幅96px)に固定し、shrink-0 で縮まないようにする。sticky top-16 でヘッダーの下に固定 */}
        <nav className="w-24 shrink-0 sticky top-[64px] bg-white border-r h-[calc(100vh-64px)] overflow-y-auto shadow-sm">
          <ul className="flex flex-col">
            {CATEGORIES.map((category) => (
              <li key={category.id}>
                <button
                  // ボタンが押されたら、activeTab をそのカテゴリのIDに変更する
                  onClick={() => setActiveTab(category.id)}
                  // 選択中のタブだけ、文字色をオレンジにして左側に太いオレンジの線を表示する
                  className={`w-full py-5 text-sm font-medium text-center border-b transition-colors
                    ${activeTab === category.id 
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-l-orange-500' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 右側：メニュー表示エリア */}
        <section className="flex-1 p-4">
          <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-2 mb-4">
            {currentCategoryLabel}
          </h2>
          
          <div className="space-y-4">
            {/* currentMenus（選択中のメニューデータ）の中身を繰り返し表示する */}
            {currentMenus.map((item) => (
              <Card key={item.id} className="shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">¥ {item.price.toLocaleString()}</p>
                  </div>
                  <Button variant="outline" className="h-10 px-4 shrink-0 ml-2">
                    追加
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>S

      </main>

      {/* 3. フッター領域（注文リストへ進む CTA ボタン） */}
      {/* fixed bottom-0 で画面下部に常に固定表示 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {/* 指で押しやすいように高さ(h-14)を十分に確保し、横幅いっぱい(w-full)にする */}
        <Button className="w-full h-14 text-lg font-bold rounded-full shadow-md">
          注文リストを見る (0)
        </Button>
      </div>

    </div>
  )
}