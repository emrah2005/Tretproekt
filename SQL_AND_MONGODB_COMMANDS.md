# MongoDB Commands for Influenita Platform

## Database Connection
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/influenita"

# Or with authentication
mongosh "mongodb://username:password@localhost:27017/influenita"
```

## Collections Setup

### 1. Users Collection
```javascript
// Create users collection with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username", "role", "createdAt"],
      properties: {
        email: { bsonType: "string", pattern: "^.+@.+$" },
        username: { bsonType: "string", minLength: 3 },
        role: { enum: ["influencer", "brand", "admin"] },
        profile: { bsonType: "object" },
        createdAt: { bsonType: "date" }
      }
    }
  }
})

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

### 2. Campaigns Collection
```javascript
// Create campaigns collection
db.createCollection("campaigns", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "brandId", "status", "createdAt"],
      properties: {
        title: { bsonType: "string" },
        brandId: { bsonType: "objectId" },
        description: { bsonType: "string" },
        budget: { bsonType: "number", minimum: 0 },
        status: { enum: ["draft", "active", "paused", "completed"] },
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        createdAt: { bsonType: "date" }
      }
    }
  }
})

// Create indexes
db.campaigns.createIndex({ brandId: 1 })
db.campaigns.createIndex({ status: 1 })
db.campaigns.createIndex({ createdAt: -1 })
```

### 3. Contracts Collection
```javascript
// Create contracts collection
db.createCollection("contracts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["campaignId", "influencerId", "status", "createdAt"],
      properties: {
        campaignId: { bsonType: "objectId" },
        influencerId: { bsonType: "objectId" },
        status: { enum: ["pending", "accepted", "rejected", "completed"] },
        terms: { bsonType: "string" },
        payment: { bsonType: "number" },
        deliverables: { bsonType: "array" },
        createdAt: { bsonType: "date" }
      }
    }
  }
})

// Create indexes
db.contracts.createIndex({ campaignId: 1, influencerId: 1 })
db.contracts.createIndex({ status: 1 })
```

## CRUD Operations

### Insert Operations
```javascript
// Insert a new influencer user
db.users.insertOne({
  email: "influencer@example.com",
  username: "influencer_user",
  role: "influencer",
  profile: {
    fullName: "John Doe",
    bio: "Fashion & Lifestyle Influencer",
    socialMedia: {
      instagram: "@johndoe",
      tiktok: "@johndoe"
    },
    followers: 50000
  },
  createdAt: new Date()
})

// Insert a campaign
db.campaigns.insertOne({
  title: "Summer Fashion Campaign",
  brandId: ObjectId("..."),
  description: "Promote our new summer collection",
  budget: 5000,
  status: "active",
  startDate: new Date("2025-06-01"),
  endDate: new Date("2025-08-31"),
  createdAt: new Date()
})
```

### Query Operations
```javascript
// Find all active campaigns
db.campaigns.find({ status: "active" })

// Find influencers with specific follower count
db.users.find({
  role: "influencer",
  "profile.followers": { $gte: 10000 }
})

// Find contracts for a specific campaign
db.contracts.find({
  campaignId: ObjectId("..."),
  status: "accepted"
})

// Aggregation: Campaign statistics
db.contracts.aggregate([
  {
    $group: {
      _id: "$campaignId",
      totalContracts: { $sum: 1 },
      totalPayment: { $sum: "$payment" },
      acceptedCount: {
        $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
      }
    }
  }
])
```

### Update Operations
```javascript
// Update campaign status
db.campaigns.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "completed" } }
)

// Update contract status
db.contracts.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "accepted", acceptedAt: new Date() } }
)

// Increment follower count
db.users.updateOne(
  { _id: ObjectId("...") },
  { $inc: { "profile.followers": 1000 } }
)
```

### Delete Operations
```javascript
// Delete a draft campaign
db.campaigns.deleteOne({ _id: ObjectId("..."), status: "draft" })

// Delete rejected contracts older than 30 days
db.contracts.deleteMany({
  status: "rejected",
  createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})
```

## Advanced Queries

### Search and Filter
```javascript
// Text search on campaigns (requires text index)
db.campaigns.createIndex({ title: "text", description: "text" })
db.campaigns.find({ $text: { $search: "fashion summer" } })

// Find campaigns within budget range
db.campaigns.find({
  budget: { $gte: 1000, $lte: 10000 },
  status: "active"
})

// Find influencers by platform
db.users.find({
  role: "influencer",
  "profile.socialMedia.instagram": { $exists: true }
})
```

### Aggregations
```javascript
// Top influencers by followers
db.users.aggregate([
  { $match: { role: "influencer" } },
  { $sort: { "profile.followers": -1 } },
  { $limit: 10 },
  { $project: {
      username: 1,
      followers: "$profile.followers",
      platforms: "$profile.socialMedia"
    }
  }
])

// Campaign performance report
db.contracts.aggregate([
  { $match: { status: "completed" } },
  { $lookup: {
      from: "campaigns",
      localField: "campaignId",
      foreignField: "_id",
      as: "campaign"
    }
  },
  { $unwind: "$campaign" },
  { $group: {
      _id: "$campaign.title",
      totalInfluencers: { $sum: 1 },
      totalSpent: { $sum: "$payment" }
    }
  }
])
```

## Backup and Maintenance

```bash
# Backup database
mongodump --db=influenita --out=/backup/path

# Restore database
mongorestore --db=influenita /backup/path/influenita

# Check database stats
db.stats()

# Check collection stats
db.users.stats()
db.campaigns.stats()
db.contracts.stats()
```

## Useful Queries for Dashboard

```javascript
// Total active campaigns
db.campaigns.countDocuments({ status: "active" })

// Pending contracts count
db.contracts.countDocuments({ status: "pending" })

// Recent sign-ups (last 7 days)
db.users.countDocuments({
  createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
})

// Revenue by month
db.contracts.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      },
      totalRevenue: { $sum: "$payment" }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])
```
