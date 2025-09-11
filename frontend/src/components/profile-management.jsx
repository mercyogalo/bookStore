"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Phone,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Camera,
  Save,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"
import { PersonIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"

// Sample profile data
const initialProfile = {
  // Personal Information
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "https://sarahmitchell.com",
  avatar: "/professional-author-headshot.jpg",

  // Author Bio
  bio: "Sarah Mitchell is a bestselling author with over a decade of experience in digital transformation and business strategy. She has written multiple acclaimed books that bridge the gap between technology and human experience. When not writing, Sarah enjoys hiking in the Bay Area and mentoring aspiring authors.",
  tagline: "Bridging technology and human experience through storytelling",
  genres: ["Business", "Fiction", "Self-Help"],
  yearsActive: 12,

  // Social Media
  socialMedia: {
    twitter: "@sarahmitchell",
    instagram: "@sarahmitchell_author",
    linkedin: "sarah-mitchell-author",
    facebook: "sarahmitchellauthor",
  },

  // Publishing Preferences
  publishingPreferences: {
    defaultGenre: "Business",
    preferredPublisher: "Independent",
    targetAudience: "Business Professionals",
    writingGoals: "2 books per year",
  },

  // Privacy Settings
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    showStats: true,
  },

  // Notification Settings
  notifications: {
    emailUpdates: true,
    salesAlerts: true,
    reviewNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
  },
}

export function ProfileManagement() {
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const handleSave = () => {
    // Here you would typically save to a backend
    console.log("Saving profile:", profile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    setProfile(initialProfile)
    setIsEditing(false)
  }

  const updateProfile = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedProfile = (section, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Profile</h1>
          <p className="text-muted-foreground">Manage your author profile and account settings</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <PersonIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="author">Author Bio</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic contact information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="text-lg">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-muted-foreground">{profile.tagline}</p>
                  <div className="flex gap-2 mt-2">
                    {profile.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateProfile("firstName", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <PersonIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.firstName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateProfile("lastName", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <PersonIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.lastName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <EnvelopeClosedIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input id="phone" value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => updateProfile("location", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => updateProfile("website", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Author Bio Tab */}
        <TabsContent value="author" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Author Biography</CardTitle>
              <CardDescription>Your professional author information and social media presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                {isEditing ? (
                  <Input
                    id="tagline"
                    value={profile.tagline}
                    onChange={(e) => updateProfile("tagline", e.target.value)}
                    placeholder="A brief description of your writing focus"
                  />
                ) : (
                  <p className="text-muted-foreground p-2">{profile.tagline}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                    rows={6}
                    placeholder="Tell readers about yourself, your background, and your writing journey..."
                  />
                ) : (
                  <p className="text-sm leading-relaxed p-2">{profile.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Years Active</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.yearsActive}
                      onChange={(e) => updateProfile("yearsActive", Number.parseInt(e.target.value))}
                    />
                  ) : (
                    <p className="p-2">{profile.yearsActive} years</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Primary Genres</Label>
                  <div className="flex flex-wrap gap-2 p-2">
                    {profile.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitter"
                          value={profile.socialMedia.twitter}
                          onChange={(e) => updateNestedProfile("socialMedia", "twitter", e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.socialMedia.twitter || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          value={profile.socialMedia.instagram}
                          onChange={(e) => updateNestedProfile("socialMedia", "instagram", e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.socialMedia.instagram || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          value={profile.socialMedia.linkedin}
                          onChange={(e) => updateNestedProfile("socialMedia", "linkedin", e.target.value)}
                          placeholder="username"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.socialMedia.linkedin || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="facebook"
                          value={profile.socialMedia.facebook}
                          onChange={(e) => updateNestedProfile("socialMedia", "facebook", e.target.value)}
                          placeholder="page name"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.socialMedia.facebook || "Not set"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Preferences</CardTitle>
              <CardDescription>Set your default preferences for book publishing and writing goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultGenre">Default Genre</Label>
                  {isEditing ? (
                    <Select
                      value={profile.publishingPreferences.defaultGenre}
                      onValueChange={(value) => updateNestedProfile("publishingPreferences", "defaultGenre", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Self-Help">Self-Help</SelectItem>
                        <SelectItem value="Biography">Biography</SelectItem>
                        <SelectItem value="Mystery">Mystery</SelectItem>
                        <SelectItem value="Romance">Romance</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2">{profile.publishingPreferences.defaultGenre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredPublisher">Publishing Type</Label>
                  {isEditing ? (
                    <Select
                      value={profile.publishingPreferences.preferredPublisher}
                      onValueChange={(value) =>
                        updateNestedProfile("publishingPreferences", "preferredPublisher", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Independent">Independent</SelectItem>
                        <SelectItem value="Traditional">Traditional</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Self-Published">Self-Published</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2">{profile.publishingPreferences.preferredPublisher}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  {isEditing ? (
                    <Input
                      id="targetAudience"
                      value={profile.publishingPreferences.targetAudience}
                      onChange={(e) => updateNestedProfile("publishingPreferences", "targetAudience", e.target.value)}
                    />
                  ) : (
                    <p className="p-2">{profile.publishingPreferences.targetAudience}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="writingGoals">Writing Goals</Label>
                  {isEditing ? (
                    <Input
                      id="writingGoals"
                      value={profile.publishingPreferences.writingGoals}
                      onChange={(e) => updateNestedProfile("publishingPreferences", "writingGoals", e.target.value)}
                    />
                  ) : (
                    <p className="p-2">{profile.publishingPreferences.writingGoals}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive general updates about your account</p>
                </div>
                <Switch
                  checked={profile.notifications.emailUpdates}
                  onCheckedChange={(checked) => updateNestedProfile("notifications", "emailUpdates", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sales Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when your books are purchased</p>
                </div>
                <Switch
                  checked={profile.notifications.salesAlerts}
                  onCheckedChange={(checked) => updateNestedProfile("notifications", "salesAlerts", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Review Notifications</Label>
                  <p className="text-sm text-muted-foreground">Be alerted when someone reviews your books</p>
                </div>
                <Switch
                  checked={profile.notifications.reviewNotifications}
                  onCheckedChange={(checked) => updateNestedProfile("notifications", "reviewNotifications", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional content and tips</p>
                </div>
                <Switch
                  checked={profile.notifications.marketingEmails}
                  onCheckedChange={(checked) => updateNestedProfile("notifications", "marketingEmails", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Get weekly summaries of your book performance</p>
                </div>
                <Switch
                  checked={profile.notifications.weeklyReports}
                  onCheckedChange={(checked) => updateNestedProfile("notifications", "weeklyReports", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control what information is visible to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                {isEditing ? (
                  <Select
                    value={profile.privacy.profileVisibility}
                    onValueChange={(value) => updateNestedProfile("privacy", "profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                      <SelectItem value="limited">Limited - Only registered users</SelectItem>
                      <SelectItem value="private">Private - Only you can view</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{profile.privacy.profileVisibility}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Contact Information Visibility</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your email</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.privacy.showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <Switch
                      checked={profile.privacy.showEmail}
                      onCheckedChange={(checked) => updateNestedProfile("privacy", "showEmail", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Phone Number</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your phone</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.privacy.showPhone ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <Switch
                      checked={profile.privacy.showPhone}
                      onCheckedChange={(checked) => updateNestedProfile("privacy", "showPhone", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Location</Label>
                    <p className="text-sm text-muted-foreground">Display your city/region</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.privacy.showLocation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <Switch
                      checked={profile.privacy.showLocation}
                      onCheckedChange={(checked) => updateNestedProfile("privacy", "showLocation", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Activity & Statistics</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Book Statistics</Label>
                    <p className="text-sm text-muted-foreground">Display sales numbers and ratings publicly</p>
                  </div>
                  <Switch
                    checked={profile.privacy.showStats}
                    onCheckedChange={(checked) => updateNestedProfile("privacy", "showStats", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Messages</Label>
                    <p className="text-sm text-muted-foreground">Let readers and other authors contact you</p>
                  </div>
                  <Switch
                    checked={profile.privacy.allowMessages}
                    onCheckedChange={(checked) => updateNestedProfile("privacy", "allowMessages", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
