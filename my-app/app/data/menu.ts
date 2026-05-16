// app/data/menu.ts

export type MenuItem = {
  id: number;
  categoryId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isSoldOut: boolean;
};

export const CATEGORIES = [
  { id: 'recommend', label: 'おすすめ' },
  { id: 'regular', label: 'レギュラー' },
  { id: 'side', label: 'サイド' },
  { id: 'drink', label: 'ドリンク' },
  { id: 'dessert', label: 'デザート' },
];

export const MENU_ITEMS: MenuItem[] = [
  // ▼ おすすめ
  { id: 1, categoryId: 'recommend', name: '店長特製 豚の角煮', price: 1200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', description: 'じっくり煮込んだトロトロの角煮です。', isSoldOut: false },
  { id: 2, categoryId: 'recommend', name: '季節の天ぷら盛り合わせ', price: 950, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80', description: '旬の野菜と海鮮をサクサクに揚げました。', isSoldOut: false },
  { id: 10, categoryId: 'recommend', name: '【大人限定】お子様ランチ', price: 1000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', description: '童心に帰りたい大人の方へ。大満足のボリュームです！', isSoldOut: false },

  // ▼ レギュラー
  { id: 3, categoryId: 'regular', name: '醤油ラーメン', price: 850, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80', description: '昔ながらのあっさり醤油味。', isSoldOut: false },
  { id: 4, categoryId: 'regular', name: '特製チャーハン', price: 700, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80', description: '強火でパラパラに炒めました。', isSoldOut: true }, 
  { id: 11, categoryId: 'regular', name: 'お子様ランチ', price: 500, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80', description: 'おもちゃ付き！', isSoldOut: false },
  
  // ▼ サイド
  { id: 5, categoryId: 'side', name: '自家製焼き餃子', price: 400, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80', description: '肉汁たっぷりの自信作。', isSoldOut: false },
  { id: 6, categoryId: 'side', name: '若鶏の唐揚げ', price: 500, image: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?auto=format&fit=crop&w=400&q=80', description: '外はサクッと、中はジューシー。', isSoldOut: false },
  { id: 13, categoryId: 'side', name: 'ロシアンたこ焼き', price: 980, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', description: '6個中1個が激辛！パーティーで盛り上がること間違いなし。', isSoldOut: false },
  { id: 14, categoryId: 'side', name: '卵焼き', price: 550, image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=400&q=80', description: 'お出汁が効いた、ふわふわの自家製卵焼きです。', isSoldOut: false },
  
  // ▼ ドリンク
  { id: 7, categoryId: 'drink', name: '生ビール (中)', price: 600, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80', description: 'キンキンに冷えた生ビール！', isSoldOut: false },
  { id: 8, categoryId: 'drink', name: 'ウーロン茶', price: 300, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80', description: 'すっきり爽快。', isSoldOut: false },
  { id: 12, categoryId: 'drink', name: 'クリームソーダ', price: 600, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', description: '昔ながらのメロンソーダにバニラアイスを乗せて。', isSoldOut: false },
  
  // ▼ デザート
  { id: 9, categoryId: 'dessert', name: '濃厚抹茶アイス', price: 350, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80', description: '京都産宇治抹茶を使用。', isSoldOut: false },
];