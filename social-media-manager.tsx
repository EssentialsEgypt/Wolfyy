"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { fetchData as fetchFacebookData } from "../../../services/platforms/facebook"
import { fetchAdsData as fetchGoogleAdsData, fetchAnalyticsData as fetchGoogleAnalyticsData } from "../../../services/platforms/google"

type Post = { id: number; content: string; scheduled: boolean }
type Comment = { id: number; content: string; flagged: boolean }
type DM = { id: number; sender: string; message: string; replied: boolean }
type Alert = { id: number; type: string; message: string }

export function SocialMediaManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [dms, setDms] = useState<DM[]>([])
  const [engagement, setEngagement] = useState({ likes: 0, comments: 0, shares: 0, likesChange: 0, commentsChange: 0, sharesChange: 0 })
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [multiAccount, setMultiAccount] = useState(false)
  const [manualOverride, setManualOverride] = useState(false)
  const [postingSchedule, setPostingSchedule] = useState("🤖 AI Suggested")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState({
    facebook: false,
    google: false
  })

  // Mock data for when connections are not available
  const mockData = {
    posts: [
      { id: 1, content: "Welcome to our Social Media Manager! 🎉", scheduled: true },
      { id: 2, content: "Connect your social accounts to see real data", scheduled: false },
      { id: 3, content: "Demo post showing scheduled content", scheduled: true },
    ],
    comments: [
      { id: 1, content: "👍 Great platform!", flagged: false },
      { id: 2, content: "Love the new features", flagged: false },
      { id: 3, content: "⚠️ This looks like spam", flagged: true },
    ],
    dms: [
      { id: 1, sender: "Customer1", message: "Hi, I'm interested in your services", replied: false },
      { id: 2, sender: "Partner", message: "Let's discuss collaboration", replied: true },
      { id: 3, sender: "Follower", message: "Thanks for the great content!", replied: true },
    ],
    engagement: { likes: 245, comments: 67, shares: 43, likesChange: 15, commentsChange: 8, sharesChange: 5 },
    alerts: [
      { id: 1, type: "info", message: "📊 Connect your social accounts to see real-time data" },
      { id: 2, type: "viral", message: "🔥 Your welcome post is performing well!" },
      { id: 3, type: "flagged", message: "🛑 1 comment flagged for review" },
    ]
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      
      let facebookConnected = false
      let googleConnected = false
      
      try {
        // Try to fetch Facebook data
        try {
          const fbData = await fetchFacebookData(1) // Replace 1 with actual user_id
          facebookConnected = true
          // Process real Facebook data here when connection exists
          console.log('Facebook data loaded:', fbData)
        } catch (fbError: any) {
          console.log('Facebook connection not available:', fbError?.message || 'Unknown error')
          facebookConnected = false
        }

        // Try to fetch Google data
        try {
          const googleAdsData = await fetchGoogleAdsData(1) // Replace 1 with actual user_id
          const googleAnalyticsData = await fetchGoogleAnalyticsData(1) // Replace 1 with actual user_id
          googleConnected = true
          // Process real Google data here when connection exists
          console.log('Google data loaded:', { googleAdsData, googleAnalyticsData })
        } catch (googleError: any) {
          console.log('Google connection not available:', googleError?.message || 'Unknown error')
          googleConnected = false
        }

        // Update connection status
        setConnectionStatus({
          facebook: facebookConnected,
          google: googleConnected
        })

        // Use mock data for demonstration (replace with real data when connections are available)
        setPosts(mockData.posts)
        setComments(mockData.comments)
        setDms(mockData.dms)
        setEngagement(mockData.engagement)
        setAlerts(mockData.alerts)
        setMultiAccount(true)
        setManualOverride(false)
        setPostingSchedule("🤖 AI Suggested")

      } catch (err: any) {
        console.error('Error loading data:', err)
        // Even if there's an error, show mock data instead of failing
        setPosts(mockData.posts)
        setComments(mockData.comments)
        setDms(mockData.dms)
        setEngagement(mockData.engagement)
        setAlerts([
          { id: 1, type: "error", message: "⚠️ Unable to load real-time data. Showing demo data." },
          ...mockData.alerts
        ])
        setError(null) // Don't show error to user, just log it
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const engagementData = [
    { name: "Likes", value: engagement.likes },
    { name: "Comments", value: engagement.comments },
    { name: "Shares", value: engagement.shares },
  ]

  if (loading) {
    return <div className="p-6">Loading social media data...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Social Media Manager</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${connectionStatus.facebook ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Facebook {connectionStatus.facebook ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${connectionStatus.google ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Google {connectionStatus.google ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">📝 Scheduled Posts</h3>
        <ul className="list-disc list-inside">
          {posts.map(post => (
            <li key={post.id} className="flex items-center gap-2">
              {post.scheduled ? <span className="text-green-600">🟢</span> : <span className="text-yellow-600">📝</span>}
              <span>{post.content}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">💬 Comments</h3>
        <ul className="list-disc list-inside">
          {comments.map(comment => (
            <li key={comment.id} className={comment.flagged ? "text-red-600" : ""}>
              {comment.content}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">📩 Direct Messages</h3>
        <ul className="list-disc list-inside">
          {dms.map(dm => (
            <li key={dm.id} className="flex items-center gap-2">
              <span>From {dm.sender}: {dm.message}</span>
              {dm.replied ? <span className="text-green-600">✅ Replied</span> : <span className="text-yellow-600">🟡 Pending</span>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">📊 Engagement Insights</h3>
        <div className="flex gap-6 mb-4">
          <div>
            <p>Likes: {engagement.likes} (<span className="text-green-600">+{engagement.likesChange}%</span>)</p>
            <p>Comments: {engagement.comments} (<span className="text-green-600">+{engagement.commentsChange}%</span>)</p>
            <p>Shares: {engagement.shares} (<span className={engagement.sharesChange < 0 ? "text-red-600" : "text-green-600"}>{engagement.sharesChange}%</span>)</p>
          </div>
          <div className="w-48 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">🚨 Alerts</h3>
        <ul className="list-disc list-inside">
          {alerts.map(alert => (
            <li key={alert.id} className={alert.type === "viral" ? "text-red-600 font-bold" : "text-yellow-700"}>
              {alert.message}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">⚙️ Settings</h3>
        <p>Multi-account posting: {multiAccount ? "✅ Enabled" : "❌ Disabled"}</p>
        <p>Manual override mode: {manualOverride ? "✅ Enabled" : "❌ Disabled"}</p>
        <p>Posting schedule: {postingSchedule}</p>
      </section>
    </div>
  )
}
