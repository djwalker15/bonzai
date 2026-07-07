# Data Model — ERD

> Visual entity-relationship diagram for the full four-view vision. Status: 🟢 validated (2026-07-02). Entities:
> [[entity-person]], [[entity-relationship]], [[entity-event]], [[entity-place]], [[entity-media]],
> [[entity-user-account]]. Patterns: [[_patterns]]. Auth entities (Grant/Invitation/Branch) are
> stubbed pending [Stage 4](../04-architecture/decisions.md).

```mermaid
erDiagram
  PERSON ||--o| USER_ACCOUNT : "linked (0..1)"
  PERSON ||--o{ RELATIONSHIP : "from"
  PERSON ||--o{ RELATIONSHIP : "to"
  PERSON ||--o{ EVENT_PARTICIPANT : "in"
  EVENT ||--o{ EVENT_PARTICIPANT : "has"
  PERSON ||--o{ RESIDENCE : "lived at"
  PLACE ||--o{ RESIDENCE : "of"
  PLACE ||--o{ EVENT : "hosts"
  PLACE ||--o{ MEDIA : "taken at"
  EVENT ||--o{ MEDIA : "documented by"
  MEDIA ||--o{ MEDIA_TAG : "tags"
  PERSON ||--o{ MEDIA_TAG : "tagged in"
  PERSON ||--o| MEDIA : "avatar"
  ALBUM ||--o{ ALBUM_MEDIA : "groups"
  MEDIA ||--o{ ALBUM_MEDIA : "in"
  EVENT ||--o| ALBUM : "album for"
  USER_ACCOUNT ||--o{ GRANT : "holds"
  PERSON ||--o{ GRANT : "anchors"
  PERSON ||--o| INVITATION : "links to"
  USER_ACCOUNT ||--o{ INVITATION : "invited by"
  USER_ACCOUNT ||--o{ ACCESS_REQUEST : "raises"
  USER_ACCOUNT ||--o{ SUGGESTED_EDIT : "proposes"
  PERSON ||--o{ ACCESS_REQUEST : "scope"

  PERSON {
    uuid id
    text first_name
    text last_name
    text birth_surname
    text preferred_name
    text gender
    date birth_date
    bool deceased
    date death_date
    text notes
    uuid avatar_media_id
  }
  RELATIONSHIP {
    uuid id
    uuid from_person_id
    uuid to_person_id
    enum type
    date start_date
    date end_date
    enum status
  }
  EVENT {
    uuid id
    text title
    enum type
    date date
    date end_date
    uuid place_id
  }
  EVENT_PARTICIPANT {
    uuid event_id
    uuid person_id
    enum role
  }
  PLACE {
    uuid id
    text name
    numeric latitude
    numeric longitude
  }
  RESIDENCE {
    uuid id
    uuid person_id
    uuid place_id
    date start_date
    date end_date
    bool is_primary
  }
  MEDIA {
    uuid id
    text storage_path
    enum kind
    text caption
    date taken_date
    uuid place_id
    uuid event_id
  }
  MEDIA_TAG {
    uuid media_id
    uuid person_id
  }
  ALBUM {
    uuid id
    text title
    text description
    uuid cover_media_id
    uuid event_id
  }
  ALBUM_MEDIA {
    uuid album_id
    uuid media_id
    int sort_order
  }
  USER_ACCOUNT {
    uuid id
    text email
    text display_name
    uuid linked_person_id
  }
  GRANT {
    uuid id
    uuid user_id
    enum role
    uuid anchor_person_id
    bool include_parents
    timestamptz revoked_at
  }
  INVITATION {
    uuid id
    text email
    uuid link_person_id
    enum role
    text token
    timestamptz accepted_at
  }
  ACCESS_REQUEST {
    uuid id
    uuid user_id
    enum requested_role
    uuid anchor_person_id
    enum status
  }
  SUGGESTED_EDIT {
    uuid id
    uuid proposer_user_id
    enum target_type
    uuid target_id
    jsonb proposed_change
    enum status
  }
```

## View → entity coverage (stress test)

| View | Reads primarily |
|---|---|
| **Graph** | Person + Relationship |
| **Timeline** | Event + EventParticipant (+ relationship dates, residence dates) |
| **Map** | Place + Residence (current = null `end_date`) + Event place |
| **Gallery** | Media + MediaTag + Album/AlbumMedia (filter by person/event/place or browse albums) |

No orphaned entities; every view maps to entities. Circular dependency check: `Person.avatar_media_id`
→ Media → `MediaTag`/`event`/`place` → Person is a soft cycle resolved by nullable FKs (avatar set
after upload).
