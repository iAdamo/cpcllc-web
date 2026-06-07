import { gql, type TypedDocumentNode } from "@apollo/client";

/* ─── Shared shapes (lightweight admin views) ─── */

export interface AdminConnection<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUserRow {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  activeRole?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isOnboardingComplete: boolean;
  isDeleted: boolean;
  averageRating: number;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserRow {
  reviewCount: number;
  language?: string;
  address?: string;
  lastLoginAt?: string;
  updatedAt: string;
  deactivation?: { reason?: string; date?: string; initiatedBy?: string } | null;
  stats: { tasksPosted: number; tasksCompleted: number };
}

export interface AdminUserStatsShape {
  total: number;
  active: number;
  suspended: number;
  unverified: number;
  newLast30Days: number;
  byRole: { clients: number; providers: number; admins: number };
}

export interface AdminProviderRow {
  _id: string;
  providerName: string;
  providerEmail?: string;
  providerPhoneNumber?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isBookable: boolean;
  followersCount: number;
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  owner?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface AdminProviderDetail extends AdminProviderRow {
  providerDescription?: string;
  isLiveTrackable: boolean;
  updatedAt: string;
  owner?: AdminProviderRow["owner"] & { phoneNumber?: string; isActive?: boolean };
  stats: { tasksTaken: number; tasksCompleted: number; followers: number; rating: number };
}

export interface AdminProviderStatsShape {
  total: number;
  verified: number;
  featured: number;
  bookable: number;
  newLast30Days: number;
  pendingKyc: number;
}

export interface AdminTaskRow {
  _id: string;
  title: string;
  budget: number;
  status: string;
  urgency?: string;
  visibility?: string;
  isActive: boolean;
  createdAt: string;
  userId?: { _id: string; firstName?: string; lastName?: string; email?: string };
  providerId?: { _id: string; providerName?: string };
  subcategoryId?: { _id: string; name?: string };
}

export interface AdminTaskDetail extends AdminTaskRow {
  description: string;
  negotiable: boolean;
  deadline?: string;
  contactPreference: string[];
  tags: string[];
  anonymous: boolean;
  updatedAt: string;
  userId?: AdminTaskRow["userId"] & { phoneNumber?: string };
  providerId?: AdminTaskRow["providerId"] & { providerEmail?: string };
}

export interface AdminTaskStatsShape {
  total: number;
  newLast30Days: number;
  byStatus: { active: number; inProgress: number; completed: number; cancelled: number; expired: number };
}

interface FilterVars {
  filter?: Record<string, unknown>;
}
interface IdVars {
  id: string;
}

/* ─── Users ─── */

export const ADMIN_USERS_QUERY: TypedDocumentNode<
  { adminUsers: AdminConnection<AdminUserRow> },
  FilterVars
> = gql`
  query AdminUsers($filter: AdminUsersFilter) {
    adminUsers(filter: $filter) {
      total
      page
      limit
      totalPages
      items {
        _id
        firstName
        lastName
        email
        phoneNumber
        activeRole
        isActive
        isEmailVerified
        isPhoneVerified
        isOnboardingComplete
        isDeleted
        averageRating
        createdAt
      }
    }
  }
`;

export const ADMIN_USER_QUERY: TypedDocumentNode<
  { adminUser: AdminUserDetail },
  IdVars
> = gql`
  query AdminUser($id: ID!) {
    adminUser(id: $id) {
      _id
      firstName
      lastName
      email
      phoneNumber
      activeRole
      isActive
      isEmailVerified
      isPhoneVerified
      isOnboardingComplete
      isDeleted
      averageRating
      reviewCount
      language
      address
      lastLoginAt
      createdAt
      updatedAt
      deactivation {
        reason
        date
        initiatedBy
      }
      stats {
        tasksPosted
        tasksCompleted
      }
    }
  }
`;

export const ADMIN_USER_STATS_QUERY: TypedDocumentNode<
  { adminUserStats: AdminUserStatsShape }
> = gql`
  query AdminUserStats {
    adminUserStats {
      total
      active
      suspended
      unverified
      newLast30Days
      byRole {
        clients
        providers
        admins
      }
    }
  }
`;

export const SUSPEND_USER_MUTATION = gql`
  mutation SuspendAdminUser($id: ID!, $reason: String!) {
    suspendAdminUser(id: $id, reason: $reason) {
      _id
      isActive
    }
  }
`;

export const REACTIVATE_USER_MUTATION = gql`
  mutation ReactivateAdminUser($id: ID!) {
    reactivateAdminUser(id: $id) {
      _id
      isActive
    }
  }
`;

export const VERIFY_USER_EMAIL_MUTATION = gql`
  mutation VerifyAdminUserEmail($id: ID!) {
    verifyAdminUserEmail(id: $id) {
      _id
      isEmailVerified
    }
  }
`;

export const VERIFY_USER_PHONE_MUTATION = gql`
  mutation VerifyAdminUserPhone($id: ID!) {
    verifyAdminUserPhone(id: $id) {
      _id
      isPhoneVerified
    }
  }
`;

/* ─── Clients (subset of users with role=Client) ─── */

export const ADMIN_CLIENTS_QUERY: TypedDocumentNode<
  { adminClients: AdminConnection<AdminUserRow> },
  FilterVars
> = gql`
  query AdminClients($filter: AdminUsersFilter) {
    adminClients(filter: $filter) {
      total
      page
      limit
      totalPages
      items {
        _id
        firstName
        lastName
        email
        phoneNumber
        isActive
        isEmailVerified
        createdAt
      }
    }
  }
`;

export const ADMIN_CLIENT_QUERY: TypedDocumentNode<
  { adminClient: AdminUserDetail },
  IdVars
> = gql`
  query AdminClient($id: ID!) {
    adminClient(id: $id) {
      _id
      firstName
      lastName
      email
      phoneNumber
      isActive
      isEmailVerified
      isPhoneVerified
      averageRating
      reviewCount
      createdAt
      stats {
        tasksPosted
        tasksCompleted
      }
    }
  }
`;

/* ─── Providers ─── */

export const ADMIN_PROVIDERS_QUERY: TypedDocumentNode<
  { adminProviders: AdminConnection<AdminProviderRow> },
  FilterVars
> = gql`
  query AdminProviders($filter: AdminProvidersFilter) {
    adminProviders(filter: $filter) {
      total
      page
      limit
      totalPages
      items {
        _id
        providerName
        providerEmail
        providerPhoneNumber
        isVerified
        isFeatured
        isBookable
        followersCount
        reviewCount
        averageRating
        createdAt
        owner {
          _id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

export const ADMIN_PROVIDER_QUERY: TypedDocumentNode<
  { adminProvider: AdminProviderDetail },
  IdVars
> = gql`
  query AdminProvider($id: ID!) {
    adminProvider(id: $id) {
      _id
      providerName
      providerDescription
      providerEmail
      providerPhoneNumber
      isVerified
      isFeatured
      isBookable
      isLiveTrackable
      followersCount
      reviewCount
      averageRating
      createdAt
      updatedAt
      owner {
        _id
        firstName
        lastName
        email
        phoneNumber
        isActive
      }
      stats {
        tasksTaken
        tasksCompleted
        followers
        rating
      }
    }
  }
`;

export const ADMIN_PROVIDER_STATS_QUERY: TypedDocumentNode<
  { adminProviderStats: AdminProviderStatsShape }
> = gql`
  query AdminProviderStats {
    adminProviderStats {
      total
      verified
      featured
      bookable
      newLast30Days
      pendingKyc
    }
  }
`;

export const APPROVE_PROVIDER_KYC_MUTATION = gql`
  mutation ApproveProviderKyc($id: ID!) {
    approveProviderKyc(id: $id) {
      _id
      isVerified
    }
  }
`;

export const REJECT_PROVIDER_KYC_MUTATION = gql`
  mutation RejectProviderKyc($id: ID!) {
    rejectProviderKyc(id: $id) {
      _id
      isVerified
    }
  }
`;

export const SET_PROVIDER_FEATURED_MUTATION = gql`
  mutation SetProviderFeatured($id: ID!, $featured: Boolean!) {
    setProviderFeatured(id: $id, featured: $featured) {
      _id
      isFeatured
    }
  }
`;

export const SET_PROVIDER_BOOKABLE_MUTATION = gql`
  mutation SetProviderBookable($id: ID!, $bookable: Boolean!) {
    setProviderBookable(id: $id, bookable: $bookable) {
      _id
      isBookable
    }
  }
`;

/* ─── Tasks ─── */

export const ADMIN_TASKS_QUERY: TypedDocumentNode<
  { adminTasks: AdminConnection<AdminTaskRow> },
  FilterVars
> = gql`
  query AdminTasks($filter: AdminTasksFilter) {
    adminTasks(filter: $filter) {
      total
      page
      limit
      totalPages
      items {
        _id
        title
        budget
        status
        urgency
        visibility
        isActive
        createdAt
        userId {
          _id
          firstName
          lastName
          email
        }
        providerId {
          _id
          providerName
        }
        subcategoryId {
          _id
          name
        }
      }
    }
  }
`;

export const ADMIN_TASK_QUERY: TypedDocumentNode<
  { adminTask: AdminTaskDetail },
  IdVars
> = gql`
  query AdminTask($id: ID!) {
    adminTask(id: $id) {
      _id
      title
      description
      budget
      negotiable
      deadline
      urgency
      visibility
      contactPreference
      tags
      status
      anonymous
      isActive
      createdAt
      updatedAt
      userId {
        _id
        firstName
        lastName
        email
        phoneNumber
      }
      providerId {
        _id
        providerName
        providerEmail
      }
      subcategoryId {
        _id
        name
      }
    }
  }
`;

export const ADMIN_TASK_STATS_QUERY: TypedDocumentNode<
  { adminTaskStats: AdminTaskStatsShape }
> = gql`
  query AdminTaskStats {
    adminTaskStats {
      total
      newLast30Days
      byStatus {
        active
        inProgress
        completed
        cancelled
        expired
      }
    }
  }
`;

export const SET_TASK_STATUS_MUTATION = gql`
  mutation SetAdminTaskStatus($id: ID!, $status: TaskStatus!) {
    setAdminTaskStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;

export const ARCHIVE_TASK_MUTATION = gql`
  mutation ArchiveAdminTask($id: ID!) {
    archiveAdminTask(id: $id) {
      _id
      isActive
    }
  }
`;

export const RESTORE_TASK_MUTATION = gql`
  mutation RestoreAdminTask($id: ID!) {
    restoreAdminTask(id: $id) {
      _id
      isActive
    }
  }
`;
