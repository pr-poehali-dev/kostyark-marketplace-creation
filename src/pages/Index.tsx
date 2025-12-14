import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: number;
  name: string;
  price: number;
  seller: string;
  rating: number;
  reviews: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const products: Product[] = [
    { id: 1, name: 'Паровой Хронометр', price: 4500, seller: 'Мастер Григорий', rating: 4.8, reviews: 156, category: 'watches', image: '⌚' },
    { id: 2, name: 'Медная Шестеренка', price: 890, seller: 'Заводъ №7', rating: 4.5, reviews: 89, category: 'parts', image: '⚙️' },
    { id: 3, name: 'Латунный Компас', price: 2300, seller: 'Навигаторъ', rating: 4.9, reviews: 234, category: 'instruments', image: '🧭' },
    { id: 4, name: 'Викторианские Очки', price: 1200, seller: 'Оптика Времени', rating: 4.6, reviews: 178, category: 'accessories', image: '👓' },
    { id: 5, name: 'Паровой Двигатель', price: 8900, seller: 'Механикус', rating: 4.9, reviews: 312, category: 'engines', image: '🔧' },
    { id: 6, name: 'Манометр Давления', price: 1450, seller: 'Измеритель', rating: 4.4, reviews: 67, category: 'instruments', image: '📊' },
    { id: 7, name: 'Кожаный Ремень', price: 670, seller: 'Кожевникъ', rating: 4.7, reviews: 145, category: 'accessories', image: '👔' },
    { id: 8, name: 'Карманные Часы', price: 3200, seller: 'Часовщикъ', rating: 4.8, reviews: 289, category: 'watches', image: '⏰' },
  ];

  const categories = [
    { id: 'all', name: 'Все категории', icon: 'Package' },
    { id: 'watches', name: 'Хронометры', icon: 'Clock' },
    { id: 'parts', name: 'Механизмы', icon: 'Settings' },
    { id: 'instruments', name: 'Приборы', icon: 'Gauge' },
    { id: 'accessories', name: 'Аксессуары', icon: 'Sparkles' },
    { id: 'engines', name: 'Двигатели', icon: 'Zap' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = product.rating >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    alert(`Платеж на сумму ${totalAmount}₽ успешно обработан! Спасибо за покупку в Костярке! ⚙️`);
    setCart([]);
    setIsCheckoutOpen(false);
    setPaymentForm({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            name="Star" 
            size={16} 
            className={i < Math.floor(rating) ? 'fill-neon-cyan text-neon-cyan' : 'text-muted-foreground'}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-xl p-12 neon-card">
        <div className="absolute top-4 right-4 text-6xl opacity-20 animate-gear-spin">⚙️</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20 animate-gear-spin" style={{animationDirection: 'reverse'}}>⚙️</div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-4 neon-glow animate-neon-pulse">КОСТЯРОКЪ</h1>
          <p className="text-2xl text-primary mb-6">Паровой Маркетплейсъ Механизмовъ</p>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Откройте для себя уникальные стимпанк-товары от лучших мастеров Империи. 
            Часовые механизмы, паровые двигатели и викторианские аксессуары ждут вас!
          </p>
          <Button size="lg" className="neon-border" onClick={() => setCurrentPage('catalog')}>
            <Icon name="ShoppingBag" size={20} className="mr-2" />
            Перейти в каталог
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 neon-glow">Популярные товары</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <Card key={product.id} className="neon-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <CardTitle className="text-primary">{product.name}</CardTitle>
                <CardDescription>{product.seller}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderStars(product.rating)}
                <p className="text-sm text-muted-foreground mt-1">{product.reviews} отзывов</p>
                <p className="text-2xl font-bold text-primary mt-4">{product.price}₽</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => addToCart(product)}>
                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск товаров или продавцов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 neon-border"
            />
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="neon-border">
              <Icon name="Filter" size={20} className="mr-2" />
              Фильтры
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="neon-glow">Фильтры поиска</DialogTitle>
              <DialogDescription>
                Настройте параметры для точного поиска
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="neon-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Цена: {priceRange[0]}₽ - {priceRange[1]}₽</Label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>
              <div className="space-y-2">
                <Label>Минимальный рейтинг: {minRating}</Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[minRating]}
                  onValueChange={(val) => setMinRating(val[0])}
                  className="py-4"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
            className={selectedCategory === cat.id ? 'neon-border' : ''}
          >
            <Icon name={cat.icon} size={16} className="mr-2" />
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="neon-card hover:scale-105 transition-transform">
            <CardHeader>
              <div className="text-6xl mb-4 text-center">{product.image}</div>
              <Badge className="w-fit mb-2" variant="secondary">
                {categories.find(c => c.id === product.category)?.name}
              </Badge>
              <CardTitle className="text-primary">{product.name}</CardTitle>
              <CardDescription>{product.seller}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStars(product.rating)}
              <p className="text-sm text-muted-foreground mt-1">{product.reviews} отзывов</p>
              <p className="text-2xl font-bold text-primary mt-4">{product.price}₽</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => addToCart(product)}>
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                В корзину
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl text-muted-foreground">Товары не найдены</p>
          <p className="text-muted-foreground mt-2">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <Card className="neon-card p-8">
      <h2 className="text-3xl font-bold mb-6 neon-glow">О нас</h2>
      <div className="space-y-4 text-lg">
        <p>
          <strong className="text-primary">Костярокъ</strong> — первый паровой маркетплейс Империи, 
          объединяющий мастеров механизмов и любителей стимпанк-культуры.
        </p>
        <p>
          Основан в 1889 году мастером Григорием Костяровым, наш маркетплейс стал домом 
          для тысяч уникальных изделий: от микроскопических часовых механизмов до 
          полноразмерных паровых двигателей.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 rounded-lg bg-card/50">
            <div className="text-4xl mb-2">⚙️</div>
            <p className="text-3xl font-bold text-primary">2500+</p>
            <p className="text-muted-foreground">Товаров</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card/50">
            <div className="text-4xl mb-2">👤</div>
            <p className="text-3xl font-bold text-primary">450+</p>
            <p className="text-muted-foreground">Мастеров</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card/50">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-3xl font-bold text-primary">4.8</p>
            <p className="text-muted-foreground">Средний рейтинг</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderSellers = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold neon-glow">Наши мастера</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Мастер Григорий', 'Заводъ №7', 'Навигаторъ', 'Оптика Времени', 'Механикус', 'Измеритель'].map((seller, idx) => {
          const sellerProducts = products.filter(p => p.seller === seller);
          const avgRating = sellerProducts.reduce((sum, p) => sum + p.rating, 0) / sellerProducts.length;
          const totalReviews = sellerProducts.reduce((sum, p) => sum + p.reviews, 0);
          
          return (
            <Card key={seller} className="neon-card">
              <CardHeader>
                <div className="text-5xl mb-2 text-center">👤</div>
                <CardTitle className="text-primary text-center">{seller}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {renderStars(avgRating)}
                <p className="text-sm text-muted-foreground mt-2">{totalReviews} отзывов</p>
                <p className="text-lg font-semibold mt-4">{sellerProducts.length} товаров</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Icon name="Store" size={16} className="mr-2" />
                  Перейти в магазин
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <Card className="neon-card p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 neon-glow">Выставить товар</h2>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-name">Название товара</Label>
          <Input id="product-name" placeholder="Паровой хронометр..." className="neon-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-price">Цена (₽)</Label>
          <Input id="product-price" type="number" placeholder="1000" className="neon-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-category">Категория</Label>
          <Select>
            <SelectTrigger id="product-category" className="neon-border">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-desc">Описание</Label>
          <Textarea 
            id="product-desc" 
            placeholder="Подробное описание вашего товара..." 
            rows={4}
            className="neon-border"
          />
        </div>
        <Button type="submit" className="w-full neon-border" size="lg">
          <Icon name="Upload" size={20} className="mr-2" />
          Выставить товар
        </Button>
      </form>
    </Card>
  );

  const renderContacts = () => (
    <Card className="neon-card p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 neon-glow">Контакты</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Icon name="MapPin" size={24} className="text-primary mt-1" />
          <div>
            <p className="font-semibold">Адрес</p>
            <p className="text-muted-foreground">г. Санкт-Петербургъ, Механическая улица, д. 42</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-4">
          <Icon name="Mail" size={24} className="text-primary mt-1" />
          <div>
            <p className="font-semibold">Электронная почта</p>
            <p className="text-muted-foreground">info@kostyarok.empire</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-4">
          <Icon name="Clock" size={24} className="text-primary mt-1" />
          <div>
            <p className="font-semibold">Часы работы</p>
            <p className="text-muted-foreground">Понедельникъ - Суббота: 9:00 - 18:00</p>
            <p className="text-muted-foreground">Воскресенье: выходной</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-primary/30 neon-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <span className="text-3xl animate-gear-spin">⚙️</span>
              <span className="text-2xl font-bold neon-glow">КОСТЯРОКЪ</span>
            </div>
            
            <div className="hidden md:flex gap-4">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'catalog', label: 'Каталог', icon: 'Package' },
                { id: 'about', label: 'О нас', icon: 'Info' },
                { id: 'sellers', label: 'Продавцы', icon: 'Store' },
                { id: 'add', label: 'Выставить товар', icon: 'Upload' },
                { id: 'contacts', label: 'Контакты', icon: 'Mail' },
              ].map(item => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage(item.id)}
                  className={currentPage === item.id ? 'neon-border' : ''}
                >
                  <Icon name={item.icon} size={16} className="mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative neon-border">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="neon-glow">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{item.image}</div>
                            <div className="flex-1">
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.price}₽</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={16} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={16} />
                              </Button>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span className="text-primary">{totalAmount}₽</span>
                        </div>
                        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full neon-border" size="lg">
                              <Icon name="CreditCard" size={20} className="mr-2" />
                              Оформить заказ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="neon-glow">Оплата заказа</DialogTitle>
                              <DialogDescription>
                                Введите данные карты для оплаты заказа на сумму {totalAmount}₽
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="card-number">Номер карты</Label>
                                <Input
                                  id="card-number"
                                  placeholder="1234 5678 9012 3456"
                                  value={paymentForm.cardNumber}
                                  onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                                  className="neon-border"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="card-holder">Имя владельца</Label>
                                <Input
                                  id="card-holder"
                                  placeholder="IVAN IVANOV"
                                  value={paymentForm.cardHolder}
                                  onChange={(e) => setPaymentForm({...paymentForm, cardHolder: e.target.value})}
                                  className="neon-border"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="expiry">Срок действия</Label>
                                  <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    value={paymentForm.expiry}
                                    onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
                                    className="neon-border"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    type="password"
                                    maxLength={3}
                                    value={paymentForm.cvv}
                                    onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                                    className="neon-border"
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handlePayment} className="w-full neon-border" size="lg">
                                <Icon name="Lock" size={20} className="mr-2" />
                                Оплатить {totalAmount}₽
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'catalog' && renderCatalog()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'sellers' && renderSellers()}
        {currentPage === 'add' && renderAddProduct()}
        {currentPage === 'contacts' && renderContacts()}
      </main>

      <footer className="bg-card border-t border-primary/30 neon-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">⚙️</span>
              <span className="text-2xl font-bold neon-glow">КОСТЯРОКЪ</span>
            </div>
            <p className="text-muted-foreground">Паровой Маркетплейсъ Механизмовъ</p>
            <p className="text-sm text-muted-foreground">© 1889-2025 Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
