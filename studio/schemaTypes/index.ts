import {seo} from './objects/seo'
import {linkItem} from './objects/linkItem'
import {homeSection} from './objects/homeSection'
import {secondScreen} from './objects/secondScreen'
import {project} from './documents/project'
import {videoCategory} from './documents/videoCategory'
import {organisation} from './documents/organisation'
import {credibilityLogo} from './documents/credibilityLogo'
import {siteSettings, navigation, homepage, hero, about, contact, info} from './documents/singletons'

export const SINGLETONS = ['siteSettings', 'navigation', 'homepage', 'hero', 'about', 'contact', 'info']

export const schemaTypes = [
  seo, linkItem, homeSection, secondScreen,
  project, videoCategory, organisation, credibilityLogo,
  siteSettings, navigation, homepage, hero, about, contact, info,
]
