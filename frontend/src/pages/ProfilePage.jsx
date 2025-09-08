import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { ProfileCard } from '../components/ProfileCard';
import { AuthorDashboard } from '../components/AuthorDashboard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  const [isAuthor, setIsAuthor] = useState(user?.isAuthor || false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        toast({ title: 'Failed to fetch profile', status: 'error' });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleUpdateProfile = (updatedData) => {
    // Update profile logic here
    console.log('Profile updated:', updatedData);
  };

  const handleUploadBook = (bookData) => {
    // Upload book logic here
    console.log('Book uploaded:', bookData);
  };

  const handleBecomeAuthor = () => {
    setIsAuthor(true);
    // Update user status to author
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar src={profile.avatar || 'https://via.placeholder.com/150'} alt={profile.name} className="h-24 w-24" />
          <div>
            <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">Role: {profile.role}</p>
          {profile.role === 'author' && (
            <p className="text-lg">Number of Books: {profile.bookCount}</p>
          )}
          {profile.role === 'reviewer' && (
            <p className="text-lg">Number of Reviews: {profile.reviewCount}</p>
          )}
        </CardContent>
      </Card>

      {isAuthor ? (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="author">Author Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileCard user={user} onUpdateProfile={handleUpdateProfile} />
          </TabsContent>

          <TabsContent value="author">
            <AuthorDashboard onUploadBook={handleUploadBook} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <ProfileCard user={user} onUpdateProfile={handleUpdateProfile} />
          
          {/* Become Author CTA */}
          <div className="text-center py-8 bg-accent/5 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Share Your Stories</h3>
            <p className="text-muted-foreground mb-4">
              Become an author and share your books with thousands of readers
            </p>
            <Button onClick={handleBecomeAuthor}>
              Become an Author
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};