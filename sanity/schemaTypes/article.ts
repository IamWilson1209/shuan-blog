import { defineField, defineType } from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.min(1).max(50).required().error("Please enter a category"),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title', maxLength: 99
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' }
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1).max(20).required().error("Please enter a category"),
    }),
    defineField({
      name: 'image',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'views',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'desc',
      type: 'text',
    }),
    defineField({
      name: 'content',
      type: 'markdown',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
})