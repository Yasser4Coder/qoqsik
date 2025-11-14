from ..models.subscription import SubscriptionPlan


def get_subscription_plans() -> list[SubscriptionPlan]:
  return [
    SubscriptionPlan(
      name="Starter",
      price="5,000 DZD",
      period="/month",
      description="Launch automation with essentials for small teams.",
      features=[
        "Up to 5 users included",
        "Extra user: 500 DZD / month",
        "One-time setup: 20,000 DZD",
        "Premium support add-on: 5,000 DZD",
      ],
    ),
    SubscriptionPlan(
      name="Professional",
      price="12,000 DZD",
      period="/month",
      description="Advanced controls and analytics for growing companies.",
      features=[
        "Up to 15 users included",
        "Extra user: 1,000 DZD / month",
        "One-time setup: 50,000 DZD",
        "Premium support add-on: 10,000 DZD",
      ],
      highlight=True,
    ),
    SubscriptionPlan(
      name="Company",
      price="20,000 DZD",
      period="/month",
      description="Enterprise readiness plus on-prem and governance.",
      features=[
        "25+ users included",
        "Extra user: 2,000 DZD / month",
        "One-time setup: 90,000 DZD",
        "On-prem add-on: 150,000 DZD / month",
        "Premium support: 15,000 DZD / month",
      ],
    ),
  ]

