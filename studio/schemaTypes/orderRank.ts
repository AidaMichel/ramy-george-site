import {defineField} from 'sanity'

/**
 * Lightweight schema definition for the orderRank value used by
 * @sanity/orderable-document-list. Keeping this field local avoids loading the
 * UI plugin while Sanity extracts the content schema in CI.
 */
export const manualOrderRankField = defineField({
  name: 'orderRank',
  title: 'Order rank',
  type: 'string',
  hidden: true,
})

export const manualOrderRankOrdering = {
  title: 'Manual order',
  name: 'manualOrder',
  by: [{field: 'orderRank', direction: 'asc' as const}],
}
