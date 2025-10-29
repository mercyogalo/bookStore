import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../Utils/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Chart } from '../components/ui/chart';
import { Heart, Star, MessageCircle, Users } from 'lucide-react';

export function BookAnalytics() {
  const { id: bookId } = useParams();
  const [analytics, setAnalytics] = useState({
    book: null,
    likes: [],
    favorites: [],
    reviews: [],
    stats: {
      totalLikes: 0,
      totalFavorites: 0,
      totalReviews: 0,
      averageRating: 0,
    },
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get(`/book/${bookId}/analytics`);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [bookId]);

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  const UserList = ({ users, title, icon: Icon }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {users.map((user) => (
            <div key={user._id} className="flex items-center space-x-4 py-2">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  if (!analytics.book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics for {analytics.book.title}</h1>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Likes" 
          value={analytics.stats.totalLikes} 
          icon={Heart} 
        />
        <StatCard 
          title="Total Favorites" 
          value={analytics.stats.totalFavorites} 
          icon={Star} 
        />
        <StatCard 
          title="Total Reviews" 
          value={analytics.stats.totalReviews} 
          icon={MessageCircle} 
        />
        <StatCard 
          title="Average Rating" 
          value={analytics.stats.averageRating.toFixed(1)} 
          icon={Star} 
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="reviews" className="mt-8">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {analytics.reviews.map((review) => (
                  <div key={review._id} className="mb-6 p-4 border-b">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{review.content}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="mt-4">
          <UserList 
            users={analytics.likes} 
            title="People who liked this book" 
            icon={Heart} 
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <UserList 
            users={analytics.favorites} 
            title="People who favorited this book" 
            icon={Star} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}