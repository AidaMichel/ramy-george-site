"""Builds the starter content from the confirmed data used in the prototype.

Outputs:
  web/src/data/seed.json         — fallback content so the site builds before Sanity is connected
  web/public/media/...           — seed images (temporary posters + logos)
  studio/seed/seed.ndjson        — `sanity dataset import` file (uploads the same images)

Every URL below came from Ramy's portfolio PDF or the user; nothing is guessed.
Missing links stay empty -> the site hides the Watch button instead of rendering a dead link.
"""
import json, os, re, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROTO = sys.argv[1]  # prototype work folder with vm/ logos/ and the CV
WEB, STUDIO = os.path.join(ROOT, 'web'), os.path.join(ROOT, 'studio')
MEDIA = os.path.join(WEB, 'public', 'media')
os.makedirs(os.path.join(MEDIA, 'posters'), exist_ok=True)
os.makedirs(os.path.join(MEDIA, 'logos'), exist_ok=True)
os.makedirs(os.path.join(STUDIO, 'seed'), exist_ok=True)

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('’', '').replace("'", '')).strip('-')
YT = 'PLTgk7ZczcBOrXMR3UsOTk07-IweNsab92'
def V(i): return f'https://vimeo.com/{i}'
def Y(v, lst, n): return f'https://www.youtube.com/watch?v={v}&list={lst}&index={n}'
LI = {
 'crime': 'https://www.linkedin.com/posts/ramy-george_crime-in-london-%D8%A7%D9%84%D8%AC%D8%B1%D9%8A%D9%85%D8%A9-%D8%AA%D8%BA%D9%8A%D8%B1-%D8%B5%D9%88%D8%B1%D8%A9-%D9%84%D9%86%D8%AF%D9%86-activity-6950059730182496257-22A9',
 'flag': 'https://www.linkedin.com/posts/ramy-george_united-arab-emirates-flag-day-%D9%8A%D9%88%D9%85-%D8%A7%D9%84%D8%B9%D9%84%D9%85-activity-6993836483040153600-8g78',
 'sing': 'https://www.linkedin.com/posts/ramy-george_the-power-of-singaporean-army-%D9%82%D9%88%D8%A9-%D8%A7%D9%84%D8%AC%D9%8A%D8%B4-activity-6979739352486563840-GZVd',
}
POSTER_SRC = {'wan_ep': 'yt__sP2TsXFwt8.jpg', 'moh_ep': 'yt_3DQ2f3FjxE8.jpg', 'tou_ep': 'yt_q_e1Dss74v4.jpg', 'hala': 'yt_knkuqpWuvkk.jpg'}
from PIL import Image
def poster(key):
    if not key: return None
    fn = POSTER_SRC.get(key, key + '.jpg')
    src = os.path.join(PROTO, 'vm', fn)
    if not os.path.exists(src): src = os.path.join(PROTO, 'crops', key + '.jpg')
    dst = os.path.join(MEDIA, 'posters', key + '.jpg'); shutil.copy(src, dst)
    w, h = Image.open(dst).size
    return {'src': f'/media/posters/{key}.jpg', 'w': w, 'h': h, 'file': dst}

CATS = [
 ('News', [('larry','larry','Larry the Cat','Al Aan TV','Editing · Music & sound · Thumbnail',V(1156803331),'9:16'),
           ('alboom','alboom','Al-Boom','Mohtawa','Editing · Music & sound · Thumbnail',V(1156803922),'9:16'),
           ('astro','astro','Voting from space','Al Ain News','Editing · Music & sound · Thumbnail',V(1156803508),'9:16'),
           ('y2020','y2020','2020: the year the earth stopped','Mohtawa','Editing · Music & sound · Thumbnail',V(581981516),'16:9'),
           ('crime','crime','Crime in London','Al Ain News','Editing · Music & sound · Thumbnail',LI['crime'],'4:5'),
           ('flag','flag','UAE Flag Day','Mohtawa','Editing · Music & sound · Thumbnail',LI['flag'],'4:5'),
           ('singapore','singapore','The power of the Singaporean army','Al Ain News','Editing · Music & sound · Thumbnail',LI['sing'],'4:5')]),
 ('Podcasts', [('wan','wan_ep','PODCASH: Wannisni','Al Mal Channel','Question flow · Editing · Promos',Y('_sP2TsXFwt8',YT,22),'16:9'),
               ('moh','moh_ep','PODCASH: Mohanad Alwadiya','Al Mal Channel','Question flow · Editing · Promos · Reels',Y('3DQ2f3FjxE8',YT,26),'16:9'),
               ('tou','tou_ep','PODCASH: Toufic Kreidieh','Al Mal Channel','Question flow · Editing · Promos · Reels',Y('q_e1Dss74v4',YT,27),'16:9')]),
 ('Influencers', [('hala','hala','Halat Hala','Hala Kazim','Editing · Color',Y('knkuqpWuvkk','PLnofMnEZlwpJthJUZ9k9GG1aGi7Q7OPtq',30),'16:9'),
                  ('anas','anas','Harvard Business School visit','Anas Bukhash','Editing',V(1156797911),'9:16'),
                  ('ali','ali','Life Endowment','Dr. Ali Khammas','Editing',V(1156798201),'9:16')]),
 ('Talking Head Reels', [('usa','usa','What does the USA want?','Al Mal Channel','Editing',V(1156799185),'9:16'),
                         ('ice','ice','Ice and Fire','Al Mal Channel','Editing',V(1041653301),'9:16'),
                         ('daheh','daheh','Daheh’s AI prophecy','Al Mal Channel','Editing',V(1156799534),'9:16'),
                         ('antarctica',None,'Antarctica: the world’s biggest desert',None,None,None,'9:16')]),
 ('Documentary', [('ain','ain','Ain al-Hayat','Mada Masr','Editing · Sound',V(581979417),'16:9'),
                  ('mcd','mcd','What’s behind the counter?','McDonald’s','Editing',V(1156386046),'16:9')]),
 ('Events & Corporate', [('eli','eli_w','Emirates Loves India','Visioneers','Editing','https://vimeo.com/showcase/12069943','16:9'),
                         ('b1','b1_w','1 Billion Followers Summit: F&B recaps','1 Billion Followers Summit','Editing','https://vimeo.com/showcase/12067760','16:9'),
                         ('wcw','wcw_w','World’s Coolest Winter','Visioneers','Editing','https://vimeo.com/showcase/11500231','16:9'),
                         ('maryah','maryah','Ramadan promos','Al Maryah Island','Editing · Color','https://vimeo.com/showcase/4715818','16:9'),
                         ('sewedy','sewedy','Beyond Tomorrow','Elsewedy Electric','Script · Editing · AI voice-over',V(1156390569),'16:9'),
                         ('etihad','etihad','Etihad Rail stand','BlueCherry','Editing',V(1156409355),'16:9'),
                         ('buildup','buildup','Build Up recap','Middle East Event Show','Editing',V(1156402285),'16:9'),
                         ('gitex','gitex','Syria is Online recap','GITEX','Editing',V(1156414994),'16:9')]),
 ('Promos & Teasers', [('wanpromo','stylish','Wannisni promo','Al Mal Channel','Promo edit',V(1156801942),'9:16'),
                       ('gar','gar','Garemet Akl restaurant commercial','Garemet Akl','Editing',V(228820416),'16:9'),
                       ('food','food','Food showreel (2017)','Showreel','Editing',V(245468514),'16:9'),
                       ('hormuz','hormuz','Portuguese conquest of Hormuz','Unofficial work','Promo edit',V(1156801779),'16:9')]),
 ('Social', [('overspend','overspend','Why do we overspend in Ramadan?','Al Mal Channel','Editing',V(1156634269),'9:16'),
             ('scarface','scarface','The Legacy of Scarface','Mohtawa','Editing',V(736673569),'16:9'),
             ('boeing','boeing','Why do Boeing 737s keep crashing?','Mohtawa','Editing',V(736666907),'16:9'),
             ('biodiv','biodiv','Convention on Biological Diversity','Unofficial work','Editing',V(1156632645),'16:9')]),
]
SECOND = {'wan': {'label': '9:16 PROMO', 'aspect': '9:16', 'posterKey': 'stylish', 'url': V(1156801942), 'watchLabel': 'Promo on Vimeo ↗'}}
DEFAULT_ASPECT_FIX = {'hala': '16:9'}

def platform(url):
    if not url: return ''
    if 'vimeo.com' in url: return 'Vimeo'
    if 'youtube.com' in url or 'youtu.be' in url: return 'YouTube'
    if 'linkedin.com' in url: return 'LinkedIn'
    return 'the web'

categories, projects, orgs = [], [], {}
for ci, (cname, items) in enumerate(CATS):
    cslug = slug(cname); categories.append({'id': 'cat-' + cslug, 'title': cname, 'slug': cslug, 'order': ci})
    for pi, (pid, pkey, title, org, role, url, aspect) in enumerate(items):
        if org: orgs.setdefault(org, {'id': 'org-' + slug(org), 'name': org})
        p = {'id': 'project-' + pid, 'slug': slug(title), 'title': title, 'kind': 'video', 'category': cslug, 'org': org or '', 'role': role or '',
             'poster': poster(pkey), 'watchUrl': url or '', 'platform': platform(url), 'aspect': aspect, 'order': pi,
             'featured': False, 'showOnHome': True, 'showOnWork': True, 'visible': bool(url)}  # hidden until its link arrives
        if pid in SECOND:
            s = dict(SECOND[pid]); s['poster'] = poster(s.pop('posterKey')); p['secondScreen'] = s
        projects.append(p)

LOGOS = [  # (name, group, file, desktop optical size in px) — order and sizes match the approved v5 design
 ('Hala Kazim','clients','hala',66), ('McDonald’s','clients','mcd',54), ('Elsewedy Electric','clients','elsewedy',44),
 ('Bukhash Brothers','clients','bukhash',42), ('Buildup','clients','buildup',38), ('BlueCherry','clients','bluecherry',42),
 ('Emirates Red Crescent','clients','erc',88),
 ('Al Mal Channel','media','almal',68), ('Al Ain News','media','alain',62), ('Abu Dhabi Media Network · Mohtawa','media','admn',58),
 ('Mada Masr','media','mada',64), ('Al Aan TV','media','alaan',50), ('IMI','media','imi',50), ('Wasl','media','wasl',54), ('New Media Academy','media','nma',70),
 ('World Government Summit','events','wgs',64), ('World Economic Forum','events','wef',56), ('GITEX Global','events','gitex',44),
 ('1 Billion Followers Summit','events','1b',48), ('World’s Coolest Winter','events','wcw',54), ('The Economist','events','economist',44),
 ('Emirates Loves India','events','eli',54),
]
logos = []
for i, (name, group, f, size) in enumerate(LOGOS):
    logo = None
    if f:
        dst = os.path.join(MEDIA, 'logos', f + '.png'); shutil.copy(os.path.join(PROTO, 'logos', f + '.png'), dst)
        w, h = Image.open(dst).size; logo = {'src': f'/media/logos/{f}.png', 'w': w, 'h': h, 'file': dst}
    # homepage logos are credibility marks, not links (master brief §32–33)
    logos.append({'id': 'logo-' + slug(name), 'name': name, 'group': group, 'logo': logo, 'size': size, 'order': i})

wm = os.path.join(MEDIA, 'wordmark.png'); shutil.copy(os.path.join(PROTO, 'logos', 'wordmark.png'), wm)
cvdst = os.path.join(WEB, 'public', 'files'); os.makedirs(cvdst, exist_ok=True)
shutil.copy(os.path.join(PROTO, 'Ramy_George_CV.pdf'), os.path.join(cvdst, 'Ramy_George_CV.pdf'))
ww, wh = Image.open(wm).size

ABOUT = ('I’m Ramy, a Video generalist and former Team Lead with experience across reels, documentaries, news reports, and large-scale event coverage, '
         'including the World Government Summit, Davos, One Billion Summit, The Economist, World’s Coolest Winter, and Emirates Love. '
         'I’ve worked with clients such as Hala Kazim, Anas Bukhash, McDonald’s, Elsewedy Electric, Al Maryah Island, and Blue Cherry. '
         'I studied Computer Science at SCU, then developed my creative career through a Graphic Design specialization at CalArts, '
         'advanced animation training at The School of Motion, and Cinematic Videography at SAE Dubai. '
         'I’m also a Golden Visa holder under Dubai Culture & Arts Authority.')
EXPERIENCE = [  # from the CV; Team Lead folded into the ADMN row as confirmed by the owner
 ('Motion Designer & Video Editor', 'Al Mal Channel', 'UAE', '2023 – present'),
 ('Video Editor, Colorist & Motion Designer', 'Hala Kazim — Halat Hala series', 'UAE', '2023 – present'),
 ('Team Lead — Lead Video Editor & Content Producer', 'Abu Dhabi Media Network (Mohtawa)', 'UAE', '2018 – present'),
 ('Senior Video Editor', 'Al Ain News', 'UAE', '2018 – 2023'),
 ('Video Editor / Colorist', 'Al Maryah Island restaurant promos', 'UAE', '2017'),
 ('Video Editor / Colorist', 'Faces Studio', 'Egypt', '2016'),
 ('Video Editor & Motion Designer', 'Sada El Balad website', 'Egypt', '2014 – 2017'),
]
TRAINING = [
 ('Cinematic Videography', 'SAE Dubai', '2026'),
 ('Animation Bootcamp', 'School of Motion', '2023'),
 ('Graphic Design Specialization', 'California Institute of the Arts (CalArts)', '2018'),
 ('Premiere Pro CC 2018 (diploma)', 'Udemy', '2018'),
 ('BSc Computer Science', 'Suez Canal University', '2010 – 2015'),
]
pdst = os.path.join(MEDIA, 'portrait.jpg'); shutil.copy(os.path.join(PROTO, 'vm', 'portrait.jpg'), pdst)
pw, ph = Image.open(pdst).size
PORTRAIT = {'src': '/media/portrait.jpg', 'w': pw, 'h': ph, 'alt': 'Ramy George at the edit suite', 'file': pdst}
site = {
 'settings': {'siteName': 'Ramy George', 'professionalTitle': 'Video Generalist', 'supportingSkills': ['Editing', 'Motion', 'Design', 'Sound Design', 'Camera', 'AI Gen'],
              'location': 'Based in Dubai', 'logo': {'src': '/media/wordmark.png', 'w': ww, 'h': wh}, 'showFooterSignature': True,
              'footer': {'showEmail': False, 'locationLine': 'Dubai, UAE', 'copyrightName': '', 'backToTopLabel': 'Back to top ↑'},
              'cv': '/files/Ramy_George_CV.pdf', 'siteUrl': '',
              'seo': {'title': 'Ramy George — Video Editor & Video Generalist in Dubai', 'description': 'Ramy George is a video editor based in Dubai, working across news, podcasts, documentary, events and branded content, with motion design, graphic design and sound.'}},
 'navigation': [{'label': 'Home', 'target': 'home', 'highlight': False, 'visible': True}, {'label': 'Work', 'target': 'work', 'highlight': False}, {'label': 'Info', 'target': 'about', 'highlight': False}, {'label': 'Let’s talk', 'target': 'contact', 'highlight': True}],
 # Contact details come from the portfolio/CV and are still to be CONFIRMED by the owner before launch.
 'contact': {'email': 'Ramy903@gmail.com', 'whatsapp': 'https://wa.me/message/MX6HDX77H4RWG1', 'linkedin': 'https://www.linkedin.com/in/ramy-george/',
             'kicker': 'Have a project in mind?', 'heading': 'Let’s talk.', 'buttonLabel': 'LET’S TALK', 'buttonTarget': 'whatsapp'},
 'hero': {'mode': 'none', 'useDashboardImage': False, 'positioningLine': 'The edit is the spine — motion, design and sound design make every beat land.', 'shortLine': 'Based in Dubai. I spend most of my time editing news, documentaries, podcasts, social and branded work, with motion, design and sound often part of the same job.', 'ctaLabel': 'See the work ↓', 'ctaTarget': 'section'},
 'about': {'heading': 'About', 'paragraph': ABOUT, 'portrait': PORTRAIT,
           'links': [{'label': 'More on the Info page →', 'kind': 'info'}, {'label': 'LinkedIn', 'kind': 'linkedin'}, {'label': 'Email', 'kind': 'email'}]},
 'info': {'heading': 'Info', 'useAboutParagraph': True, 'intro': '', 'showPortrait': True,
          'experience': [{'role': r, 'organisation': o, 'location': c, 'years': y} for r, o, c, y in EXPERIENCE],
          'training': [{'course': c, 'institution': o, 'year': y} for c, o, y in TRAINING],
          'showCv': True, 'cvLabel': 'Download CV ↗'},
 'home': {'sections': [{'key': k, 'visible': True, 'heading': h, 'microcopy': m} for k, h, m in [
             ('hero', '', ''), ('video', 'Editing', 'BROWSE DIFFERENT FORMATS'), ('motion', 'Motion & AI', 'Short muted loops · drag, swipe or use the arrows'),
             ('posts', 'Posts & Carousels', 'Original artwork, in its original order'), ('clients', 'Clients & Coverage', ''),
             ('about', 'About', ''), ('contact', '', '')]],
          'defaultCategory': 'news', 'defaultProject': '',
          'motionFilters': [{'key': 'all', 'label': 'All'}, {'key': 'motion', 'label': 'Motion'}, {'key': 'ai', 'label': 'AI Gen'}, {'key': 'logo', 'label': 'Logo Animation'}],
          'logoGroupHeadings': {'clients': 'Clients & Collaborations', 'media': 'Media & Organisations', 'events': 'Events & Coverage'},
          'logoGroupVisibility': {'clients': True, 'media': True, 'events': True}},
 'categories': categories, 'projects': projects, 'logos': logos,
}
def strip(o):
    if isinstance(o, dict): return {k: strip(v) for k, v in o.items() if k != 'file'}
    if isinstance(o, list): return [strip(x) for x in o]
    return o
os.makedirs(os.path.join(WEB, 'src', 'data'), exist_ok=True)
json.dump(strip(site), open(os.path.join(WEB, 'src', 'data', 'seed.json'), 'w'), ensure_ascii=False, indent=1)

# ---------- Sanity NDJSON ----------
def asset(img, kind='image'):
    if not img: return None
    return {'_type': kind, '_sanityAsset': f"{kind}@file://{os.path.relpath(img['file'], ROOT)}"}
def ref(i): return {'_type': 'reference', '_ref': i}
def rank(i): return '0|' + format(100000 + i * 1000, 'x').rjust(6, '0') + ':'
docs = []
for c in categories:
    docs.append({'_id': c['id'], '_type': 'videoCategory', 'title': c['title'], 'slug': {'_type': 'slug', 'current': c['slug']}, 'visible': True, 'orderRank': rank(c['order'])})
for o in orgs.values():
    docs.append({'_id': o['id'], '_type': 'organisation', 'name': o['name']})
for gi, p in enumerate(projects):
    d = {'_id': p['id'], '_type': 'project', 'title': p['title'], 'slug': {'_type': 'slug', 'current': p['slug']}, 'kind': 'video',
         'category': ref('cat-' + p['category']), 'role': p['role'], 'watchUrl': p['watchUrl'] or None, 'aspect': p['aspect'], 'visible': p['visible'], 'featured': False,
         'status': 'active', 'showOnHome': True, 'showOnWork': True, 'orderRank': rank(gi)}
    if p['org']: d['organisation'] = ref(orgs[p['org']]['id'])
    if p['poster']: d['poster'] = asset(p['poster'])
    if p.get('secondScreen'):
        s = p['secondScreen']; d['secondScreen'] = {'_type': 'secondScreen', 'enabled': True, 'label': s['label'], 'aspect': s['aspect'], 'url': s['url'], 'watchLabel': s['watchLabel'], 'poster': asset(s['poster'])}
    docs.append({k: v for k, v in d.items() if v is not None})
for l in logos:
    d = {'_id': l['id'], '_type': 'credibilityLogo', 'name': l['name'], 'group': l['group'], 'size': l['size'], 'destination': 'none', 'displayVersion': 'light', 'visible': True, 'orderRank': rank(l['order'])}
    if l['logo']: d['logo'] = asset(l['logo'])
    docs.append(d)
s = site
docs.append({'_id': 'siteSettings', '_type': 'siteSettings', 'siteName': 'Ramy George', 'professionalTitle': 'Video Generalist', 'supportingSkills': s['settings']['supportingSkills'],
             'location': 'Based in Dubai', 'logo': {'_type': 'image', '_sanityAsset': f'image@file://{os.path.relpath(wm, ROOT)}'}, 'showFooterSignature': True,
             'footer': dict(s['settings']['footer']),
             'cv': {'_type': 'file', '_sanityAsset': f"file@file://{os.path.relpath(os.path.join(cvdst, 'Ramy_George_CV.pdf'), ROOT)}"},
             'defaultSeo': {'_type': 'seo', **s['settings']['seo']}})
docs.append({'_id': 'navigation', '_type': 'navigation', 'items': [{'_key': f'n{i}', '_type': 'navItem', **n, 'visible': True} for i, n in enumerate(s['navigation'])]})
docs.append({'_id': 'contact', '_type': 'contact', **{k: v for k, v in s['contact'].items()}})
docs.append({'_id': 'hero', '_type': 'hero', 'mode': 'none', 'useDashboardImage': False, 'shortLine': 'Based in Dubai. I spend most of my time editing news, documentaries, podcasts, social and branded work, with motion, design and sound often part of the same job.', 'ctaLabel': 'See the work ↓', 'ctaTarget': 'section'})
docs.append({'_id': 'about', '_type': 'about', 'heading': 'About', 'paragraph': ABOUT, 'portrait': {**asset(PORTRAIT), 'alt': PORTRAIT['alt']},
             'links': [{'_key': f'l{i}', '_type': 'linkItem', 'visible': True, **l} for i, l in enumerate(s['about']['links'])]})
docs.append({'_id': 'homepage', '_type': 'homepage',
             'sections': [{'_key': x['key'], '_type': 'homeSection', 'variant': 'default', **{k: v for k, v in x.items() if v != ''}} for x in s['home']['sections']],
             'defaultCategory': ref('cat-news'),
             'motionFilters': [{'_key': f['key'], '_type': 'motionFilter', 'visible': True, **f} for f in s['home']['motionFilters']],
             'logoGroupHeadings': s['home']['logoGroupHeadings'], 'logoGroupVisibility': s['home']['logoGroupVisibility']})
i = s['info']
docs.append({'_id': 'info', '_type': 'info', 'heading': i['heading'], 'useAboutParagraph': True, 'showPortrait': True, 'showCv': True, 'cvLabel': i['cvLabel'],
             'experience': [{'_key': f'e{k}', '_type': 'role', **x} for k, x in enumerate(i['experience'])],
             'training': [{'_key': f't{k}', '_type': 'course', **x} for k, x in enumerate(i['training'])]})
with open(os.path.join(STUDIO, 'seed', 'seed.ndjson'), 'w') as fh:
    for d in docs: fh.write(json.dumps(d, ensure_ascii=False) + '\n')
print('projects', len(projects), 'logos', len(logos), 'docs', len(docs))
