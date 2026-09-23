import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {
  ArchiveIcon,
  CaseIcon,
  CogIcon,
  EnvelopeIcon,
  HomeIcon,
  ImageIcon,
  ImagesIcon,
  MenuIcon,
  PlayIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  UserIcon,
} from '@sanity/icons'

const single = (S: any, type: string, title: string, icon: any) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({apiVersion: '2025-01-01'})
  const categories: {_id: string; title: string}[] = await client.fetch('*[_type=="videoCategory"]|order(orderRank){_id,title}')

  const orderable = (type: string, title: string, icon: any, filter?: string, params?: Record<string, unknown>, id?: string) =>
    orderableDocumentListDeskItem({type, title, icon, filter, params, id, S, context})

  return S.list()
    .title('Ramy George')
    .items([
      S.listItem().title('HOME').icon(HomeIcon).child(
        S.list().title('Home').items([
          single(S, 'homepage', 'Homepage Layout', HomeIcon),
          single(S, 'hero', 'Hero', StarIcon),
          single(S, 'about', 'About', UserIcon),
          single(S, 'info', 'Info page', UserIcon),
          single(S, 'contact', 'Contact', EnvelopeIcon),
        ]),
      ),
      S.listItem().title('WORK').icon(PlayIcon).child(
        S.list().title('Work').items([
          S.listItem().title('All Projects').icon(PlayIcon).child(S.documentTypeList('project').title('All Projects')),
          S.listItem().title('Video').icon(PlayIcon).child(
            S.list().title('Video — drag to reorder inside a category').items([
              orderable('videoCategory', 'Categories (order + visibility)', TagIcon, undefined, undefined, 'order-categories'),
              S.divider(),
              ...categories.map((c) =>
                orderable('project', c.title, PlayIcon, 'kind == "video" && category._ref == $cat', {cat: c._id}, `order-cat-${c._id.replace(/[^a-zA-Z0-9-]/g, '')}`),
              ),
            ]),
          ),
          orderable('project', 'Motion & AI', SparklesIcon, 'kind == "motion"', undefined, 'order-motion'),
          orderable('project', 'Posts & Carousels', ImagesIcon, 'kind == "post"', undefined, 'order-posts'),
          S.listItem().title('Archived').icon(ArchiveIcon).child(S.documentList().title('Archived').filter('_type == "project" && status == "archived"')),
        ]),
      ),
      S.listItem().title('CREDIBILITY').icon(ImageIcon).child(
        S.list().title('Clients & Coverage — drag to reorder').items([
          orderable('credibilityLogo', 'Clients & Collaborations', ImageIcon, 'group == "clients"', undefined, 'order-logos-clients'),
          orderable('credibilityLogo', 'Media & Organisations', ImageIcon, 'group == "media"', undefined, 'order-logos-media'),
          orderable('credibilityLogo', 'Events & Coverage', ImageIcon, 'group == "events"', undefined, 'order-logos-events'),
        ]),
      ),
      S.listItem().title('CONTENT').icon(CaseIcon).child(
        S.list().title('Content').items([
          S.documentTypeListItem('organisation').title('Organisations').icon(CaseIcon),
          S.documentTypeListItem('videoCategory').title('Categories').icon(TagIcon),
        ]),
      ),
      S.listItem().title('SETTINGS').icon(CogIcon).child(
        S.list().title('Settings').items([
          single(S, 'siteSettings', 'Site Settings', CogIcon),
          single(S, 'navigation', 'Navigation', MenuIcon),
        ]),
      ),
    ])
}
