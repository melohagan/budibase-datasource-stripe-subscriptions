import { IntegrationBase, SqlQuery } from "@budibase/types"
import Stripe from "stripe"

class CustomIntegration implements IntegrationBase {
  private readonly stripe: Stripe

  constructor(config: { apiKey: string; }) {
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2022-08-01'
    })
  }

  async create(query: { json: object; extra: { [key: string]: string } }) {
    if (query.extra.subtype === "core") {
      return await this.stripe.subscriptions.create(query.json as Stripe.SubscriptionCreateParams)
    }
    if (query.extra.subtype === "items") {
      return await this.stripe.subscriptionItems.create(query.json as Stripe.SubscriptionItemCreateParams)
    }
    if (query.extra.subtype === "schedules") {
      return await this.stripe.subscriptionSchedules.create(query.json as Stripe.SubscriptionScheduleCreateParams)
    }
    throw new Error("You must provide a sub-type!")
  }

  async read(query: { id: string; extra: { [key: string]: string } }) {
    if (query.extra.subtype === "core") {
      return await this.stripe.subscriptions.retrieve(query.id)
    }
    if (query.extra.subtype === "items") {
      return await this.stripe.subscriptionItems.retrieve(query.id)
    }
    if (query.extra.subtype === "schedules") {
      return await this.stripe.subscriptionSchedules.retrieve(query.id)
    }
    throw new Error("You must provide a sub-type!")
  }

  async update(query: { id: string, body: string; extra: { [key: string]: string } }) {
    if (query.extra.subtype === "core") {
      return await this.stripe.subscriptions.update(query.id, JSON.parse(query.body))
    }
    if (query.extra.subtype === "items") {
      return await this.stripe.subscriptionItems.update(query.id, JSON.parse(query.body))
    }
    if (query.extra.subtype === "schedules") {
      return await this.stripe.subscriptionSchedules.update(query.id, JSON.parse(query.body))
    }
    throw new Error("You must provide a sub-type!")
  }

  async delete(query: { id: string; extra: { [key: string]: string } }) {
    if (query.extra.subtype === "core") {
      return await this.stripe.subscriptions.del(query.id)
    }
    if (query.extra.subtype === "items") {
      return await this.stripe.subscriptionItems.del(query.id)
    }
    if (query.extra.subtype === "schedules") {
      return await this.stripe.subscriptionSchedules.cancel(query.id)
    }
    throw new Error("You must provide a sub-type!")
  }

  async list(query: { json: object; extra: { [key: string]: string } }) {
    if (query.extra.subtype === "core") {
      return await this.stripe.subscriptions.list(query.json)
    }
    if (query.extra.subtype === "items") {
      return await this.stripe.subscriptionItems.list(query.json as Stripe.SubscriptionItemListParams)
    }
    if (query.extra.subtype === "schedules") {
      return await this.stripe.subscriptionSchedules.list(query.json)
    }
    throw new Error("You must provide a sub-type!")
  }

  async searchSubscriptions(query: { query: string, limit: number, page: string }) {
    return await this.stripe.subscriptions.search({
      query: query.query,
      limit: query.limit,
      page: query.page,
    })
  }

  async releaseSchedule(query: { id: string }) {
    return await this.stripe.subscriptionSchedules.release(query.id)
  }
}

export default CustomIntegration
