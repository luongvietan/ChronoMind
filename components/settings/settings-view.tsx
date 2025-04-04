"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, User, Bell, Clock, Shield } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SettingsView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState(user?.user_metadata?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [productiveStartHour, setProductiveStartHour] = useState("09:00")
  const [productiveEndHour, setProductiveEndHour] = useState("17:00")

  // Load user preferences from localStorage or default values
  useEffect(() => {
    if (user) {
      try {
        const storedPreferences = localStorage.getItem("chronomind_preferences")
        if (storedPreferences) {
          const preferences = JSON.parse(storedPreferences)
          setEmailNotifications(preferences.notifications?.email ?? true)
          setPushNotifications(preferences.notifications?.push ?? true)

          if (preferences.productiveHours) {
            const startHour = preferences.productiveHours.start || 9
            const endHour = preferences.productiveHours.end || 17

            setProductiveStartHour(`${startHour.toString().padStart(2, "0")}:00`)
            setProductiveEndHour(`${endHour.toString().padStart(2, "0")}:00`)
          }
        }
      } catch (err) {
        console.error("Error loading preferences:", err)
      }
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user) return

    setIsUpdating(true)
    setUpdateError(null)

    try {
      const { error } = await supabaseBrowser.auth.updateUser({
        data: {
          name,
          avatar_url: avatarUrl,
        },
      })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (err) {
      console.error("Error updating profile:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setUpdateError(errorMessage)
      toast({
        title: "Error updating profile",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdatePreferences = async () => {
    if (!user) return

    setIsUpdating(true)
    setUpdateError(null)

    try {
      // Parse hours from time strings
      const startHour = Number.parseInt(productiveStartHour.split(":")[0])
      const endHour = Number.parseInt(productiveEndHour.split(":")[0])

      // Save preferences to localStorage
      const preferences = {
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          sms: false,
        },
        productiveHours: {
          start: startHour,
          end: endHour,
        },
        theme: "system",
      }

      localStorage.setItem("chronomind_preferences", JSON.stringify(preferences))

      // Try to update in Supabase if available
      try {
        await supabaseBrowser
          .from("users")
          .update({
            preferences: preferences,
          })
          .eq("id", user.id)
      } catch (dbErr) {
        console.error("Error updating preferences in database:", dbErr)
        // Continue anyway since we saved to localStorage
      }

      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully",
      })
    } catch (err) {
      console.error("Error updating preferences:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setUpdateError(errorMessage)
      toast({
        title: "Error updating preferences",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    setIsUploading(true)

    try {
      // For demo purposes, we'll use a data URL instead of actual upload
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result.toString())
          setIsUploading(false)
          toast({
            title: "Avatar updated",
            description: "Your avatar has been updated successfully",
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Error uploading avatar:", err)
      setIsUploading(false)
      toast({
        title: "Error uploading avatar",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Preferences</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Account</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information and profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {updateError && (
              <Alert variant="destructive">
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} alt={name} />
                <AvatarFallback className="text-lg">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="relative">
                <Button variant="outline" size="sm" className="relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Upload Avatar</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience and notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {updateError && (
              <Alert variant="destructive">
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive task reminders and updates via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                </div>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Productive Hours
              </h3>
              <p className="text-sm text-muted-foreground">
                Set your most productive hours for optimal task scheduling
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={productiveStartHour}
                    onChange={(e) => setProductiveStartHour(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={productiveEndHour}
                    onChange={(e) => setProductiveEndHour(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdatePreferences} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password
              </h3>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

