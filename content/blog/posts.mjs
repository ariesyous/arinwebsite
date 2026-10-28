// Edit this source, then run: node scripts/build-blog.mjs
// Publishing and research requirements: docs/blog-workflow.md
const citation = (number) =>
  `<a class="citation" href="#source-${number}" aria-label="Read source ${number}">[${number}]</a>`;

export const posts = [
  {
    slug: "draughty-door-repair-or-replace",
    title: "A draughty door doesn’t always need replacing",
    category: "Home comfort",
    excerpt:
      "Find out where the air is getting in, then separate a worn seal from a door or frame that needs more attention.",
    published: "2026-10-22",
    updated: "2026-10-22",
    checked: "2026-10-22",
    sources: [
      {
        publisher: "Natural Resources Canada",
        title:
          "Keeping the Heat In, section 4: Comprehensive air leakage control",
        url: "https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/keeping-heat-section-4-comprehensive-air-leakage-control-your-home",
      },
      {
        publisher: "Natural Resources Canada",
        title: "Keeping the Heat In, section 3: Materials and weatherstripping",
        url: "https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/keeping-heat-section-3-materials-insulation-house-wrap-barriers-weatherstripping",
      },
    ],
    body: `
      <p>A cold patch beside the front door can make a replacement look like the obvious next purchase. Before choosing a new door, write down what actually happens: air moving past the latch, a gap at the bottom, or a room that feels cold without an obvious draught. Those observations make a much better starting point than “the entrance is freezing.”</p>
      <h2>Find where the air gets in</h2>
      <p>Natural Resources Canada identifies door frames and thresholds among the places to investigate for air leakage. Its guidance also explains that finding leaks is easier in cold, windy conditions. Check the accessible perimeter without taking anything apart, and note the location rather than assuming the entire door is defective. ${citation(1)}</p>
      <p>Try describing the pattern: does it happen with the door fully latched? At one edge or around the whole frame? Only in wind? Photograph damaged seals and any visible staining. This is an observation exercise, not a reason to run a homemade pressure test or disturb electrical fittings.</p>
      <h2>Match the material to the joint</h2>
      <p>Two jobs that look similar need different materials. NRCan describes caulking, tapes, and gaskets for joints between materials that do not move, while weatherstripping is used where parts must move, including operable windows and doors. A continuous bead of caulk is therefore not a substitute for a functioning door seal. ${citation(2)}</p>
      <p>Before buying a replacement strip, note the existing profile and how the door closes. Ask whether the proposed product fits the opening and still allows the door to latch normally. A thicker strip that stops the door closing properly has not fixed anything.</p>
      <h2>Keep the repair question separate from the replacement question</h2>
      <p>If the door rubs, will not latch, or has soft or stained material nearby, include that in the assessment. Ask what needs attention before a new seal is selected. Request separate explanations for a seal repair and a full replacement, including what each option would leave unresolved.</p>
      <p>A whole-house draught problem also deserves a wider look. NRCan notes that comprehensive air sealing affects humidity, ventilation, and combustion-air supply. An energy advisor or air-sealing specialist can assess the house as a system before every visible gap is sealed. ${citation(1)}</p>
      <h2>What to send with an enquiry</h2>
      <ul><li>A photograph of the full door and a close-up of the problem edge.</li><li>Where you feel moving air and when it is noticeable.</li><li>Whether the door closes and latches without force.</li><li>Any water staining, damaged finishes, or previous repair attempts.</li></ul>
      <p>A useful brief could be: “Cold air comes past the latch edge on windy days. The door still closes normally. Please assess the fit and seal before recommending a replacement.” That gives the assessment a clear question to answer.</p>
    `,
  },
  {
    slug: "paint-preparation-that-lasts",
    title: "The prep work that makes a paint refresh last",
    category: "Painting & finishing",
    excerpt:
      "Cleaning, repairs, and the right primer belong in the plan before anyone opens a tin of the new colour.",
    published: "2026-10-22",
    updated: "2026-10-22",
    checked: "2026-10-22",
    sources: [
      {
        publisher: "Benjamin Moore",
        title: "How to Prepare Walls for Painting",
        url: "https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/preparing-walls-painting",
      },
      {
        publisher: "Sherwin-Williams",
        title: "Paint Application Frequently Asked Questions",
        url: "https://www.sherwin-williams.com/homeowners/tv/painting-and-staining-faqs/painting-application-faqs",
      },
      {
        publisher: "Health Canada",
        title: "Lead-based paint",
        url: "https://www.canada.ca/en/health-canada/services/home-safety/lead-based-paint.html",
      },
    ],
    body: `
      <p>“Paint the spare room” can mean a straightforward colour change or several quite different repair jobs. A greasy wall, torn wallpaper backing, old patches, and an unknown coating do not become the same surface just because the finish colour is the same. Before comparing quotes, agree on what will make the walls ready.</p>
      <h2>Start with the surface’s history</h2>
      <p>For older or uncertain coatings, check the hazard question before sanding or scraping. Health Canada explains that older Canadian homes may contain lead-based paint and that disturbing it can release harmful material. Its guidance describes laboratory analysis and specialist detection as ways to investigate. Do not assume a newer topcoat proves the layers underneath are safe to disturb. ${citation(3)}</p>
      <p>Once the surface is appropriate to work on, walk the room in daylight. Mark what you want addressed: nail holes, old repair edges, peeling areas, adhesive, and trim damage. A photograph of each issue is more useful than asking for “a perfect finish” without defining the starting condition.</p>
      <h2>Clean first, then decide what needs repair</h2>
      <p>Benjamin Moore’s preparation guidance puts cleaning before the coating. It recommends removing dirt and, where relevant, grease, rinsing cleaning residue, and allowing the surface to dry thoroughly. It also identifies smoothing uneven areas and removing the resulting dust as part of preparation where needed. ${citation(1)}</p>
      <p>That matters when you describe the work. “Two coats” says very little about what happens to the old cooking residue behind a table or the ridge around an earlier patch. Ask whether cleaning, patching, smoothing, and dust removal are included, and which defects will remain visible.</p>
      <h2>Primer is a surface decision</h2>
      <p>A wall exposed by wallpaper removal may need a different treatment from an intact painted wall. Sherwin-Williams specifically discusses damaged drywall facing after wallpaper removal and the use of a suitable conditioner before subsequent finishing. That is a reason to identify the substrate and select a compatible preparation system, rather than treating every problem with another coat of finish paint. ${citation(2)}</p>
      <p>Ask for the proposed primer or conditioner by name and the reason it is needed. A good answer ties the product to the surface you have, rather than promising that a more expensive paint will hide everything.</p>
      <h2>Make the timetable product-specific</h2>
      <p>Sherwin-Williams also notes that application conditions and drying depend on the product and environment, and directs readers to product labels and data pages. Use those instructions for application and waiting periods instead of assuming every coating can be recoated on the same schedule. ${citation(2)}</p>
      <ul><li>Define the walls, ceilings, trim, and doors included.</li><li>List cleaning and repairs separately from finish coats.</li><li>Confirm how floors, furniture, and adjoining surfaces will be protected.</li><li>Record the coating system, finish, and colour.</li><li>Agree on when the room can be put back into normal use.</li></ul>
      <p>A clear preparation scope makes two painting proposals much easier to compare. It also gives the finished room a fair standard to be checked against.</p>
    `,
  },
  {
    slug: "bathroom-refresh-planning-halton",
    title: "A bathroom refresh: decide what stays before pricing what changes",
    category: "Renovation planning",
    excerpt:
      "A practical scope checklist for Halton homeowners, including where local permits and electrical requirements enter the conversation.",
    published: "2026-10-22",
    updated: "2026-10-22",
    checked: "2026-10-22",
    sources: [
      {
        publisher: "Town of Oakville",
        title: "Interior Alteration",
        url: "https://www.oakville.ca/home-environment/building-renovations/building-permits-inspections/construction-projects/interior-alteration/",
      },
      {
        publisher: "Electrical Safety Authority",
        title: "About Licensed Electrical Contractors",
        url: "https://esasafe.com/hiring-an-electrician-or-contractor/",
      },
      {
        publisher: "Town of Milton",
        title: "Building Permits",
        url: "https://www.milton.ca/business-development/building-and-renovating/building-permits/",
      },
      {
        publisher: "Electrical Safety Authority",
        title: "Notifications and Inspections",
        url: "https://esasafe.com/compliance/what-you-need-to-know/",
      },
    ],
    body: `
      <p>If your bathroom feels tired, start by naming the problem instead of choosing a demolition date. Is the issue worn paint, awkward storage, a damaged finish, or a layout that no longer works? A new mirror and refreshed cabinetry answer a different brief from moving a shower. Mixing the two makes an estimate difficult to interpret.</p>
      <h2>Draw two lists: stays and changes</h2>
      <p>On a simple room sketch, mark the toilet, basin, bath or shower, doorway, and existing lights. Then make a “stays” list and a “changes” list. Be explicit about fixtures that will remain in their current position and about any wall, plumbing, or electrical changes you are considering.</p>
      <p>In Oakville, the town’s interior-alteration guidance distinguishes decorative work from changes such as wall removal and adding or relocating plumbing fixtures. It says permits typically are not required for replacing existing cabinetry, sinks, faucets, toilets, and cosmetic surface changes. Note the word “typically”: it doesn’t clear every bathroom project. ${citation(1)}</p>
      <h2>Check the property and the municipality</h2>
      <p>Use the written scope when contacting your municipal building team. Ask which approvals and documents apply to that property and that work before committing to a start date. For Milton projects, start with the town’s building-permit hub rather than assuming an Oakville example settles a Milton application. ${citation(3)}</p>
      <p>Have the address, an existing-versus-proposed sketch, and any condominium or other property-management requirements available. If the scope changes after that conversation, ask whether the approval requirements change too. Keep the response with the project notes so everyone is working from the same understanding.</p>
      <h2>Keep electrical responsibilities visible</h2>
      <p>A general renovation scope should identify who will carry out any electrical work. The Electrical Safety Authority states that when a general contractor subcontracts electrical work, it must be done by a Licensed Electrical Contractor. Ask for the contracting business’s ECRA/ESA licence details and verify them with ESA. ${citation(2)}</p>
      <p>Also ask the electrical contractor which notification and inspection steps apply and who is arranging them. ESA’s guidance describes notification and inspection as part of the electrical work process; these questions should be settled before work is concealed, not at the decorating stage. ${citation(4)}</p>
      <h2>Write a brief someone can actually estimate</h2>
      <ul><li><strong>Keep:</strong> fixtures, walls, and finishes that stay, with their locations.</li><li><strong>Change:</strong> each replacement or alteration, including who supplies it.</li><li><strong>Known issues:</strong> leaks, loose finishes, previous repairs, or access problems.</li><li><strong>Daily use:</strong> whether another bathroom is available during the work.</li><li><strong>Approvals:</strong> who confirms requirements and obtains relevant permissions.</li><li><strong>Unknowns:</strong> how findings after opening a surface will be documented and approved.</li></ul>
      <p>Bring that same brief to each discussion. Two proposals can then be compared against an agreed scope rather than the vague label “bathroom renovation.” Choose the finishes once you understand which work they depend on.</p>
    `,
  },
  {
    slug: "grout-repair-or-shower-leak",
    title: "Cracked grout: when a shower needs a closer look",
    category: "Tile & bathroom care",
    excerpt:
      "Separate a tired-looking joint from a water-management problem before choosing a cosmetic repair.",
    published: "2026-10-22",
    updated: "2026-10-22",
    checked: "2026-10-22",
    sources: [
      {
        publisher: "Schluter-Systems",
        title: "What are waterproofing membranes?",
        url: "https://www.schluter.com/schluter-us/en_US/blog-waterproofing-membrane-for-a-shower",
      },
      {
        publisher: "Tile Council of North America",
        title: "Cracked/Loose Grout",
        url: "https://tcnatile.com/resource-center/faq/cracked-loose-grout/",
      },
      {
        publisher: "Health Canada",
        title: "Guide to addressing moisture and mould indoors",
        url: "https://www.canada.ca/en/health-canada/services/publications/healthy-living/addressing-moisture-mould-your-home.html",
      },
      {
        publisher: "Tile Council of North America",
        title: "Grout: caulk and movement at joints",
        url: "https://tcnatile.com/resource-center/faq/grout/",
      },
    ],
    body: `
      <p>A stained joint and a damp ceiling below the shower can look like one problem with one tidy fix: replace the grout. They are different observations. Before asking for a new finish, establish whether the task is appearance, a failing joint, or water escaping the shower assembly. Colour alone does not answer that question.</p>
      <h2>The visible tile is only part of the system</h2>
      <p>Schluter-Systems explains that tile and grout are not, on their own, a waterproof barrier. Its guidance describes waterproofing behind the finish as the layer intended to protect the structure. Improving the visible grout therefore does not demonstrate that an existing waterproofing assembly is sound. ${citation(1)}</p>
      <p>For a repair proposal, ask what is known about the existing installation and what cannot be confirmed without further investigation. A good colour match suits a cosmetic job, but it tells you nothing about where a leak is coming from.</p>
      <h2>What a crack can and can’t tell you</h2>
      <p>The Tile Council of North America lists several possible reasons for cracked or loose grout, including substrate movement, insufficiently packed joints, and mixing or installation problems. It notes that a field inspection may be needed to identify the cause. A recurring crack should prompt a question about the underlying condition, rather than an automatic repeat of the previous repair. ${citation(2)}</p>
      <p>Location matters in that discussion. Record whether the crack is between tiles on a flat surface, in a corner, or where surfaces meet. TCNA’s grout guidance explains that using rigid grout where a suitable flexible joint is needed can create problems as surfaces move. The appropriate joint detail should be selected for the installation, not simply matched to whichever tube is available. ${citation(4)}</p>
      <h2>Deal with ongoing water before decorating</h2>
      <p>If water is actively escaping, stop using the affected shower until the problem has been assessed. Keep a record of when moisture appears and where it is visible; do not open concealed areas just to collect a photograph.</p>
      <p>Health Canada advises identifying and correcting the source of moisture, and seeking professional help when moisture problems or suspected hidden mould are unclear. Its guidance also states that painting over mould only hides it temporarily. A surface refresh should not stand in for resolving persistent dampness. ${citation(3)}</p>
      <h2>Four useful questions before approving work</h2>
      <ul><li>Is the proposed work cosmetic, joint maintenance, or an investigation of a leak?</li><li>What evidence supports that scope, and what remains uncertain?</li><li>How will the existing waterproofing and movement-joint details be respected?</li><li>What would trigger a revised scope before the work continues?</li></ul>
      <p>A carefully limited grout repair can be appropriate once its purpose is clear. The important distinction is whether the repair addresses the problem you actually have. If dampness or cracking returns, keep the earlier repair details and reassess the cause instead of treating a new surface as proof of a solution.</p>
    `,
  },
];
