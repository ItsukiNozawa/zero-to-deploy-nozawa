'use client'

import { useState } from 'react'
import { Yuji_Syuku } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// データの分離インポートを継続
import { CATEGORIES, MENU_ITEMS, MenuItem } from "./data/menu"

const yuji = Yuji_Syuku({ 
  weight: '400',
  subsets: ['latin'],
})

type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'menu'>('welcome')
  const [partySize, setPartySize] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('recommend')
  
  const [cart, setCart] = useState<CartItem[]>([]) 
  const [isCartOpen, setIsCartOpen] = useState(false) 
  
  const [isCallStaffOpen, setIsCallStaffOpen] = useState(false) 
  const [showCallNotification, setShowCallNotification] = useState(false) 
  const [showOrderNotification, setShowOrderNotification] = useState(false) 
  const [orderHistory, setOrderHistory] = useState<CartItem[]>([]) 

  const currentMenus = MENU_ITEMS.filter(item => item.categoryId === activeTab)
  const currentCategoryLabel = CATEGORIES.find(c => c.id === activeTab)?.label

  // 店員呼出チャイム
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(); osc1.stop(ctx.currentTime + 0.5);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(698.46, ctx.currentTime);
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc2.start(); osc2.stop(ctx.currentTime + 0.8);
      }, 150);
    } catch (e) { console.log(e); }
  }

  const handleCallStaffConfirm = () => {
    setIsCallStaffOpen(false) 
    setShowCallNotification(true) 
    playChime() 
    setTimeout(() => setShowCallNotification(false), 3000)
  }

  const addToCart = (item: MenuItem) => {
    if (item.isSoldOut) {
      alert(`【エラー】\n申し訳ありません。「${item.name}」は現在品切れのため追加できません。`)
      return
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.menuItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) => cartItem.menuItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
      }
      return [...prevCart, { menuItem: item, quantity: 1 }]
    })
  }

  // ★ 注文を確定する処理
  const handleConfirmOrder = () => {
    if (cart.length === 0) return
    setOrderHistory((prevHistory) => {
      const updatedHistory = [...prevHistory]
      cart.forEach((cartItem) => {
        const existing = updatedHistory.find((h) => h.menuItem.id === cartItem.menuItem.id)
        if (existing) { existing.quantity += cartItem.quantity } else { updatedHistory.push({ ...cartItem }) }
      })
      return updatedHistory
    })
    setCart([])
    
    // ★ 改善ポイント1: 注文確定と同時にリスト画面を自動で閉じる
    setIsCartOpen(false)
    
    // 完了バナーを表示
    setShowOrderNotification(true)
    setTimeout(() => setShowOrderNotification(false), 3000)
  }

  const totalAmount = [...cart, ...orderHistory].reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const splitAmount = partySize && partySize > 0 ? Math.ceil(totalAmount / partySize) : 0

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans text-gray-900">
        <div className="w-20 h-20 bg-white rounded-md shadow-sm flex items-center justify-center p-2 mb-6">
          <img src="/logo.jpg" alt="ロゴ" className="w-full h-full object-contain" />
        </div>
        <h1 className={`text-4xl font-bold mb-10 text-orange-500 tracking-wider ${yuji.className}`}>いらっしゃいませ！</h1>
        <Card className="w-full max-w-sm shadow-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <p className="text-gray-600 font-medium mb-4">何人でご利用ですか？</p>
            <div className="grid grid-cols-5 gap-2 mb-6 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Button
                  key={num}
                  variant={partySize === num ? "default" : "outline"}
                  className={`h-12 text-lg font-bold transition-colors ${partySize === num ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' : 'text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
                  onClick={() => setPartySize(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
            <Button className="w-full h-14 text-lg font-bold rounded-full shadow-md bg-orange-500 hover:bg-orange-600 text-white mt-4" onClick={() => { if (partySize === null) { alert('【エラー】\nご利用の人数を選択してください。'); } else { setCurrentScreen('menu'); } }}>メニューを見る</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      
      {/* ＝＝＝＝＝ 上部通知バナー（最前面表示に変更） ＝＝＝＝＝ */}
      {/* ★ 改善ポイント2: zIndex を 20000 に引き上げ、絶対に何よりも上に表示させます */}
      {showCallNotification && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20000 }} className="bg-green-600 text-white text-center py-3 font-bold text-sm shadow-md animate-pulse">
          🔔 店員を呼んでいます。少々お待ちください...
        </div>
      )}
      {showOrderNotification && (
        <div style={{ position: 'fixed', top: showCallNotification ? '48px' : 0, left: 0, right: 0, zIndex: 20000 }} className="bg-blue-600 text-white text-center py-3 font-bold text-sm shadow-md animate-pulse">
          🎉 注文が正常に送信されました！
        </div>
      )}

      {/* ＝＝＝＝＝ ヘッダー ＝＝＝＝＝ */}
      <header style={{ height: '68px' }} className="sticky top-0 z-50 bg-orange-400 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 bg-white rounded-md flex-shrink-0 shadow-sm flex items-center justify-center p-1">
            <img src="/logo.jpg" alt="ロゴ" className="w-full h-full object-contain" />
          </div>
          <h1 className={`text-xl font-bold tracking-widest text-white ${yuji.className} mt-1`}>OSAKI 亭</h1>
          <button onClick={() => setIsCallStaffOpen(true)} className="ml-1 bg-orange-500 hover:bg-orange-600 text-white border border-orange-300 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm active:scale-95 transition-transform">🔔 店員呼出</button>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="bg-white text-orange-600 px-3 py-2 rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform">
          📋 注文リスト ({totalQuantity})
        </button>
      </header>

      {/* ＝＝＝＝＝ 左バナー（ナビゲーション） ＝＝＝＝＝ */}
      <nav 
        style={{ position: 'fixed', top: '68px', left: 0, bottom: '76px', width: '96px' }} 
        className="bg-white border-r overflow-y-auto shadow-sm z-40"
      >
        <ul className="flex flex-col">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setActiveTab(category.id)}
                className={`w-full py-5 text-sm font-medium text-center border-b transition-colors
                  ${activeTab === category.id ? 'bg-orange-50 text-orange-600 border-l-4 border-l-orange-500' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ＝＝＝＝＝ 右コンテンツ ＝＝＝＝＝ */}
      <section className="p-3" style={{ marginLeft: '96px' }}>
        <div className="flex justify-between items-center border-b-2 border-gray-800 pb-2 mb-4">
          <h2 className="text-lg font-bold">{currentCategoryLabel}</h2>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">{partySize}名様</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {currentMenus.map((item) => (
            <Card key={item.id} className="shadow-sm flex flex-col overflow-hidden relative">
              {item.isSoldOut && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <span style={{ color: '#dc2626', borderColor: '#dc2626' }} className="border-2 bg-white/90 font-bold px-3 py-1 text-base rounded-sm transform -rotate-12 tracking-widest">売り切れ</span>
                </div>
              )}
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              </div>
              <CardContent className="p-3 flex flex-col flex-1 gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-xs leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">¥ {item.price.toLocaleString()}</p>
                </div>
                <Button variant="outline" onClick={() => addToCart(item)} style={item.isSoldOut ? { color: '#dc2626', borderColor: '#fca5a5' } : {}} className="w-full h-8 text-xs mt-auto bg-white">
                  {item.isSoldOut ? '売り切れ' : '追加'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ＝＝＝＝＝ フッター ＝＝＝＝＝ */}
      <div style={{ height: '76px' }} className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button onClick={() => setIsCartOpen(true)} className="w-full h-14 text-lg font-bold rounded-full shadow-md bg-orange-500 hover:bg-orange-600 text-white flex justify-center items-center gap-2">
          注文リストを見る ({totalQuantity})
        </Button>
      </div>

      {/* 店員呼出確認ポップアップ */}
      {isCallStaffOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifycontent: 'center', padding: '1.5rem' }}>
          <Card className="w-full max-w-xs shadow-xl bg-white overflow-hiddenM mx-auto my-auto">
            <CardContent className="p-6 text-center">
              <p className="text-xl font-bold text-gray-800 mb-6">店員を呼びますか？</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleCallStaffConfirm} className="bg-orange-500 text-white w-24 font-bold h-11">Yes</Button>
                <Button variant="outline" onClick={() => setIsCallStaffOpen(false)} className="w-24 font-bold h-11">No</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 注文リストモーダル */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
          <div className="bg-orange-400 text-white p-4 flex justify-between items-center shadow-md">
            <h2 className={`text-xl font-bold tracking-widest ${yuji.className}`}>注文リスト</h2>
            <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 bg-white/20 rounded-full font-bold text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {cart.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-orange-500 mb-2 tracking-wider">カート内の未注文メニュー</h3>
                <ul className="space-y-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                  {cart.map((cartItem) => (
                    <li key={cartItem.menuItem.id} className="flex justify-between items-center border-b pb-3 last:border-none last:pb-0">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{cartItem.menuItem.name}</p>
                        <p className="text-sm text-gray-500">¥{cartItem.menuItem.price.toLocaleString()} × {cartItem.quantity}点</p>
                      </div>
                      <p className="font-bold text-sm text-gray-900">¥{(cartItem.menuItem.price * cartItem.quantity).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {orderHistory.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-emerald-600 mb-2 tracking-wider flex items-center gap-1">✓ 送信済みの注文履歴</h3>
                <ul className="space-y-4 bg-emerald-50/60 p-3 rounded-md border border-emerald-100">
                  {orderHistory.map((historyItem) => (
                    <li key={`history-${historyItem.menuItem.id}`} className="flex justify-between items-center border-b border-emerald-100 pb-3 last:border-none last:pb-0">
                      <div>
                        <p className="font-bold text-gray-700 text-sm">{historyItem.menuItem.name}</p>
                        <p className="text-sm text-gray-400">¥{historyItem.menuItem.price.toLocaleString()} × {historyItem.quantity}点</p>
                      </div>
                      <p className="font-bold text-sm text-gray-600">¥{(historyItem.menuItem.price * historyItem.quantity).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cart.length === 0 && orderHistory.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400"><p className="text-lg font-bold mb-2">注文リストは空です</p></div>
            )}
          </div>
          <div className="bg-white p-6 border-t shadow-md">
            <div className="flex justify-between items-end mb-2"><span className="font-bold text-gray-600">合計金額</span><span className="text-3xl font-bold text-orange-600">¥{totalAmount.toLocaleString()}</span></div>
            {partySize && partySize > 1 && totalAmount > 0 && (
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed text-gray-600"><span className="text-sm">1人あたり（{partySize}名で割り勘）</span><span className="font-bold text-lg">¥{splitAmount.toLocaleString()}</span></div>
            )}
            <Button onClick={handleConfirmOrder} disabled={cart.length === 0} className="w-full h-14 text-lg font-bold rounded-full bg-orange-500 text-white mt-6 disabled:opacity-50">注文を確定する</Button>
          </div>
        </div>
      )}

    </div>
  )
}