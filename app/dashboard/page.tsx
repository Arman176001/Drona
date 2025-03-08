"use client"

import { useState } from "react"
import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  LineChart,
  MoreHorizontal,
  PieChart,
  Plus,
  Rocket,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts and stats
  const learningStats = [
    { title: "Study Hours", value: "24.5", icon: Clock, change: "+12%", color: "from-indigo-500 to-blue-500" },
    { title: "Completed Courses", value: "7", icon: GraduationCap, change: "+2", color: "from-purple-500 to-pink-500" },
    { title: "Quiz Score Avg", value: "87%", icon: Target, change: "+5%", color: "from-emerald-500 to-teal-500" },
    { title: "Streak Days", value: "14", icon: Trophy, change: "+3", color: "from-amber-500 to-orange-500" },
  ]

  const upcomingEvents = [
    { title: "Advanced AI Concepts", type: "Quiz", date: "Today, 3:00 PM", color: "bg-indigo-500" },
    { title: "Machine Learning Basics", type: "Study Session", date: "Tomorrow, 10:00 AM", color: "bg-purple-500" },
    { title: "Neural Networks", type: "Live Class", date: "Mar 7, 2:00 PM", color: "bg-emerald-500" },
  ]

  const recentActivities = [
    { title: "Completed Quiz: Python Fundamentals", time: "2 hours ago", score: "92%" },
    { title: "Studied: Data Structures & Algorithms", time: "Yesterday", duration: "45 min" },
    { title: "Created Flashcards: JavaScript", time: "2 days ago", count: "24 cards" },
  ]

  const recommendedCourses = [
    { title: "Advanced Machine Learning", level: "Intermediate", rating: 4.8, students: 1245 },
    { title: "Full-Stack Web Development", level: "Advanced", rating: 4.9, students: 3421 },
    { title: "Data Science Fundamentals", level: "Beginner", rating: 4.7, students: 2198 },
  ]

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] opacity-20"></div>

        {/* Animated particles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-indigo-500"
              style={{
                width: `${Math.random() * 6 + 1}px`,
                height: `${Math.random() * 6 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: "0 0 20px 2px rgba(99, 102, 241, 0.7)",
                animation: `float ${Math.random() * 10 + 20}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Glowing accents */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 z-10 relative">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's an overview of your learning journey</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 text-sm font-medium text-white transition-all duration-200 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              March 2025
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-8 flex overflow-x-auto pb-2 z-10 relative">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-lg p-1">
            {["overview", "progress", "courses", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
          {learningStats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                  <p className="text-emerald-400 text-sm mt-1 flex items-center">
                    {stat.change}
                    <span className="ml-1">↑</span>
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} relative`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative">
          {/* Learning Progress Chart */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Learning Progress</h2>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                  <LineChart className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                  <PieChart className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Placeholder for chart - in a real app, you'd use a chart library */}
            <div className="h-64 w-full bg-gradient-to-b from-indigo-500/20 to-purple-500/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-indigo-400 mx-auto mb-2 opacity-50" />
                <p className="text-gray-400 text-sm">Interactive learning progress chart would appear here</p>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-sm text-gray-400">Study Time</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-400">Quiz Scores</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sm text-gray-400">Completion Rate</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
              <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`${event.color} p-2 rounded-lg mt-0.5`}>
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{event.type}</span>
                      <span className="text-xs text-gray-400 ml-2">{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-gray-300 transition-colors">
              View All Events
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-white font-medium">{activity.title}</h3>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{activity.time}</span>
                    {activity.score && <span className="text-xs text-emerald-400">Score: {activity.score}</span>}
                    {activity.duration && (
                      <span className="text-xs text-indigo-400">Duration: {activity.duration}</span>
                    )}
                    {activity.count && <span className="text-xs text-purple-400">Created: {activity.count}</span>}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-gray-300 transition-colors">
              View All Activity
            </button>
          </div>

          {/* Recommended Courses */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Recommended Courses</h2>
              <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCourses.map((course, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                      </div>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{course.level}</span>
                    </div>
                    <h3 className="text-white font-medium mb-2">{course.title}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-amber-400 mr-1" />
                        <span className="text-xs text-gray-300">{course.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">{course.students}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-gray-300 transition-colors">
              Browse All Courses
            </button>
          </div>

          {/* Learning Goals */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Learning Goals</h2>
              <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <Plus className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium">Complete Machine Learning Course</h3>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">75%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Target completion: March 15, 2025</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium">Build 5 AI Projects</h3>
                  <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">40%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">2 of 5 projects completed</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium">Achieve 90% Quiz Average</h3>
                  <span className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">87%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: "87%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Current average: 87%</p>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center">
              <Rocket className="h-4 w-4 mr-2" />
              Set New Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

