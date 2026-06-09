import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Teachers | Pinmark",
  description:
    "Curriculum alignment, lesson guidance, and printable worksheets for using Pinmark in the classroom."
};

export default function ForTeachersPage() {
  return (
    <main className="pm-teachers">
      <header className="pm-teachers__header">
        <Link href="/" className="pm-back-link">← Back to game</Link>
        <h1>Pinmark in the Classroom</h1>
        <p className="pm-teachers__intro">
          Pinmark is a NZ geography game designed for Year 8-9 students (Levels 4-5 of the New Zealand
          Curriculum). Students look at a photo of a real New Zealand location, drop a pin on the map
          to make their guess, then learn why that place matters. Each pack takes 20-30 minutes to play
          as a class or in pairs on a Chromebook, tablet, or laptop.
        </p>
      </header>

      <section className="pm-teachers__section">
        <h2>Curriculum Alignment</h2>
        <p>
          Pinmark supports the <strong>Social Sciences</strong> learning area, specifically the
          Geography strand, at Levels 4-5 of the NZ Curriculum. The table below shows how each pack
          maps to key curriculum objectives.
        </p>

        <div className="pm-table-wrap">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Pack</th>
                <th>Curriculum Strand</th>
                <th>Key Learning Objectives</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Landforms &amp; Mountains</strong></td>
                <td>Place and Environment</td>
                <td>
                  Students understand how natural processes (tectonic activity, glaciation, erosion)
                  have shaped New Zealand's physical landscape. They identify major landforms and
                  explain the processes that created them.
                </td>
                <td>Level 4</td>
              </tr>
              <tr>
                <td><strong>Water, Lakes &amp; Coast</strong></td>
                <td>Place and Environment</td>
                <td>
                  Students describe the characteristics of New Zealand's aquatic environments,
                  including lakes, rivers, coastlines, and marine habitats. They explain how water
                  shapes the land and supports ecosystems.
                </td>
                <td>Level 4</td>
              </tr>
              <tr>
                <td><strong>Cities &amp; People</strong></td>
                <td>Social Organisation; Place and Environment</td>
                <td>
                  Students explain why New Zealand's cities and towns are located where they are,
                  considering access to harbours, rivers, agricultural land, and resources. They
                  understand patterns of urban growth and settlement.
                </td>
                <td>Level 4-5</td>
              </tr>
              <tr>
                <td><strong>Cultural &amp; Historic Sites</strong></td>
                <td>Continuity and Change; Cultural Diversity</td>
                <td>
                  Students explore the cultural and historical significance of key places in Aotearoa,
                  including tangata whenua sites, colonial heritage, and places that shaped New Zealand
                  identity. They develop respect for te reo Māori place names.
                </td>
                <td>Level 4-5</td>
              </tr>
              <tr>
                <td><strong>Climate &amp; Environment</strong></td>
                <td>Place and Environment</td>
                <td>
                  Students compare climate across New Zealand's regions and explain how geography
                  influences weather patterns. They understand the importance of conservation and
                  biodiversity, and identify human impacts on the environment.
                </td>
                <td>Level 5</td>
              </tr>
              <tr>
                <td><strong>Grand Aotearoa Tour</strong></td>
                <td>All strands (synthesis)</td>
                <td>
                  A mixed-difficulty challenge that brings together learning from all five packs.
                  Students demonstrate their knowledge of New Zealand's diverse geography, from
                  volcanic islands to glaciers, from colonial towns to Māori cultural sites.
                </td>
                <td>Level 4-5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="pm-teachers__section">
        <h2>How to Use in Class</h2>
        <div className="pm-teachers__tips">
          <div className="pm-tip">
            <h3>Warm-Up (5 min)</h3>
            <p>
              Project the game on a whiteboard. Start with the easiest pack (<em>Cities &amp; People</em>).
              Ask students: &ldquo;Where in Aotearoa do you think this is?&rdquo; Let them vote on a region
              before playing.
            </p>
          </div>
          <div className="pm-tip">
            <h3>Individual or Pairs (20-25 min)</h3>
            <p>
              Students play a pack on their own device. They read the &ldquo;Why is it here?&rdquo; and
              &ldquo;Did you know?&rdquo; sections carefully before moving on. Encourage discussion
              within pairs.
            </p>
          </div>
          <div className="pm-tip">
            <h3>Discussion (5-10 min)</h3>
            <p>
              After playing, ask: Which place surprised you most? Can you name three landforms that
              glaciers created? Why is Auckland so much bigger than other cities?
            </p>
          </div>
          <div className="pm-tip">
            <h3>Extension</h3>
            <p>
              Students choose a location from the pack and write a paragraph explaining why it is
              geographically significant. They must use at least two geographic terms (e.g. fjord,
              tectonic, erosion, urban, indigenous).
            </p>
          </div>
        </div>
      </section>

      <section className="pm-teachers__section pm-print-section">
        <h2>Printable Worksheet</h2>
        <p className="pm-no-print">
          Use your browser&rsquo;s Print function (Ctrl+P / Cmd+P) to print this worksheet. It is
          formatted to print cleanly on A4 paper.
        </p>

        <div className="pm-worksheet">
          <div className="pm-worksheet__header">
            <h3>Pinmark: Aotearoa Explorer</h3>
            <p>Name: _________________________ Class: _____________ Date: ________________</p>
            <p>Pack: _________________________</p>
          </div>

          <h4>Part 1: Map It!</h4>
          <p>
            For each location in your pack, write the name and the region it is in, and circle
            whether it is in the North Island or South Island.
          </p>
          <table className="pm-worksheet__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Location Name</th>
                <th>Region</th>
                <th>Island</th>
                <th>My Stars</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>North / South</td>
                  <td>☆ ☆ ☆</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Part 2: Geography Questions</h4>
          <ol className="pm-worksheet__questions">
            <li>Choose one location and describe <strong>why</strong> it is in that part of New Zealand. Use geographic terms.</li>
            <li>What natural process created the landform or feature at one of your locations? Explain in 2-3 sentences.</li>
            <li>How does the climate or environment of one location affect the people or animals that live there?</li>
            <li>Name one te reo Māori place name from your pack. What does it tell us about that place or its history?</li>
            <li>Which location surprised you most? Why?</li>
          </ol>

          <h4>Part 3: Reflection</h4>
          <p>What is one thing you learned about Aotearoa New Zealand from this game that you did not know before?</p>
          <div className="pm-worksheet__lines">
            {[1, 2, 3].map((n) => (
              <div key={n} className="pm-worksheet__line" />
            ))}
          </div>
          <p>My total stars: _____ / 18</p>
        </div>
      </section>

      <section className="pm-teachers__section pm-no-print">
        <h2>Photos &amp; Data Sources</h2>
        <p>
          All photographs used in Pinmark are sourced from{" "}
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer">
            Wikimedia Commons
          </a>{" "}
          under open licences (CC BY, CC BY-SA, or Public Domain). Each photo&rsquo;s credit,
          licence, and source URL is stored in the game data and displayed under every image.
        </p>
        <p>
          Geographic facts are verified against two sources for every location: Wikipedia and
          an official New Zealand source such as{" "}
          <a href="https://www.doc.govt.nz" target="_blank" rel="noopener noreferrer">DOC</a>,{" "}
          <a href="https://teara.govt.nz" target="_blank" rel="noopener noreferrer">Te Ara</a>,{" "}
          <a href="https://www.geonet.org.nz" target="_blank" rel="noopener noreferrer">GeoNet</a>, or{" "}
          <a href="https://www.nzhistory.govt.nz" target="_blank" rel="noopener noreferrer">NZHistory</a>.
        </p>
        <p>
          <Link href="/">← Back to Pinmark</Link>
        </p>
      </section>
    </main>
  );
}
