import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, User, ArrowLeft, Share2, Loader2 } from 'lucide-react';
import { getNewsArticles } from '../lib/data';
import type { NewsArticle } from '../lib/data';

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const data = await getNewsArticles();
      setNews(data);
      setIsLoading(false);
    };
    loadNews();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const article = news.find((n) => n.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
          <Link to="/berita">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Berita
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedNews = news
    .filter((n) => n.id !== article.id && n.category === article.category)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/berita')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Berita
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <div className="h-96 overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8">
                <div className="mb-4">
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(article.date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t">
                  <Button variant="outline" className="gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Bagikan Berita
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {relatedNews.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Berita Terkait</h3>
                  <div className="space-y-4">
                    {relatedNews.map((related) => (
                      <Link key={related.id} to={`/berita/${related.id}`} className="block group">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                            <img
                              src={related.thumbnail}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                              {related.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(related.date).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Kategori</h3>
                <div className="space-y-2">
                  {Array.from(new Set(news.map((n) => n.category))).map((category) => {
                    const count = news.filter((n) => n.category === category).length;
                    return (
                      <Link
                        key={category}
                        to="/berita"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <span>{category}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}