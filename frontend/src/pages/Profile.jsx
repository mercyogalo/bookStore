import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        toast({ title: "Failed to fetch profile", status: "error" });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-center">
          <Skeleton className="h-24 w-24 rounded-full mb-4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mb-2 mx-auto" />
          <Skeleton className="h-6 w-1/3 mb-2 mx-auto" />
          <Skeleton className="h-6 w-1/4 mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 text-center">
      
        <div className="flex justify-center mb-6">
          <Avatar
            src={profile.avatar || "https://via.placeholder.com/150"}
            alt={profile.name}
            className="h-32 w-32 rounded-full border-4 border-blue-500"
          />
        </div>

  
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2">
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Name:</span> {profile.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-medium">Role:</span> {profile.role}
          </p>
        </CardContent>

        <hr className="my-6 border-gray-300" />
  
       
      </Card>
    </div>
  );
};
