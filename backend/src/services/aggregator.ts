import { supabase, isOpportunitiesTableAvailable } from './db';
import { getEmbedding } from './aiService';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  source: string;
  category: string;
  department: string;
  location: string;
  eligibility: string;
  skills: string[];
  description: string;
  apply_link: string;
  deadline: string;
  image_url?: string;
  embedding?: number[];
  created_at: string;
}

// In-Memory Database Fallback
export let mockOpportunities: Opportunity[] = [];

// Raw seed templates to fetch/generate opportunities
const OPPORTUNITY_TEMPLATES = [
  {
    title: 'AI / ML Research Intern',
    company: 'Google',
    source: 'Company Career Pages',
    category: 'internship',
    department: 'Computer Science & Engineering',
    location: 'Bangalore, India',
    eligibility: 'Pre-final / Final year B.Tech/M.Tech CS students',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'TensorFlow', 'LLMs'],
    description: 'Join Google Research in Bangalore to work on Generative AI systems, model fine-tuning, and natural language understanding algorithms. Interns will write code, run experiments, and contribute to production ML systems.',
    apply_link: 'https://careers.google.com',
    deadlineDays: 30,
    image_url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'Full Stack Developer Job',
    company: 'Microsoft',
    source: 'LinkedIn Jobs',
    category: 'job',
    department: 'Computer Science & Engineering',
    location: 'Remote',
    eligibility: 'Graduating B.Tech CS/IT students, CGPA > 8.0',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'CSS', 'Tailwind'],
    description: 'Microsoft Azure core developer division is hiring full stack engineers. You will design, build, and deploy highly scalable web applications, REST APIs, and microservices in a cloud-first environment.',
    apply_link: 'https://careers.microsoft.com',
    deadlineDays: 15,
    image_url: 'https://images.unsplash.com/photo-1625014618427-fbc980b974f5?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'Smart India Hackathon 2026',
    company: 'Govt of India',
    source: 'Unstop',
    category: 'hackathon',
    department: 'Computer Science & Engineering',
    location: 'New Delhi, India',
    eligibility: 'Open to all Indian engineering students',
    skills: ['React', 'Flask', 'AI', 'IoT', 'Python', 'Mobile App'],
    description: 'National-level Hackathon solving core engineering, infrastructure, and agricultural challenges. Win prizes up to $5000 and connect directly with top incubator hubs and ministries.',
    apply_link: 'https://unstop.com',
    deadlineDays: 5,
    image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'CAD Design Intern',
    company: 'Tesla',
    source: 'Company Career Pages',
    category: 'internship',
    department: 'Mechanical Engineering',
    location: 'Bangalore, India',
    eligibility: 'Mechanical / Automobile Engineering students in 3rd/4th year',
    skills: ['CAD', 'SolidWorks', 'CATIA', 'Finite Element Analysis', 'Ansys'],
    description: 'Tesla energy products design team is hiring mechanical CAD interns. You will work on layout design, stress simulations, thermal constraints, and manufacturing draft designs for powerpack subassemblies.',
    apply_link: 'https://careers.tesla.com',
    deadlineDays: 20,
    image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'Embedded Systems Engineer',
    company: 'Intel',
    source: 'Wellfound',
    category: 'job',
    department: 'Electronics & Communication Engineering',
    location: 'Bangalore, India',
    eligibility: 'ECE/EEE graduates with Embedded Project Experience',
    skills: ['Embedded C', 'RTOS', 'Microcontrollers', 'IoT', 'C++', 'Verilog'],
    description: 'Intel network hardware group is hiring embedded system developers. Work on firmware interfaces, hardware abstraction layers (HAL), device drivers, and real-time operations systems optimizations.',
    apply_link: 'https://careers.intel.com',
    deadlineDays: 12,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'VLSI Chip Architect Job',
    company: 'Qualcomm',
    source: 'Naukri',
    category: 'job',
    department: 'Electronics & Communication Engineering',
    location: 'Hyderabad, India',
    eligibility: 'ECE graduates or M.Tech VLSI candidates',
    skills: ['VLSI', 'Verilog', 'SystemVerilog', 'ASIC', 'FPGA'],
    description: 'Design and verify high-performance system-on-chips. You will be responsible for ASIC frontend design, chip synthesis, simulation validations, and power grid calculations for Snapdragon architectures.',
    apply_link: 'https://careers.qualcomm.com',
    deadlineDays: 25,
    image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'IoT Security Workshop & Competition',
    company: 'UniSync Electronics Club',
    source: 'Unstop',
    category: 'workshop',
    department: 'Electronics & Communication Engineering',
    location: 'Campus Seminar Hall',
    eligibility: 'Open to ECE & CSE students',
    skills: ['IoT', 'Security', 'Embedded C', 'Hardware Pentesting'],
    description: 'A 2-day hands-on workshop on hacking IoT device firmware, finding memory leaks, and implementing hardware security protocols. Ends with a 12-hour hardware security capture-the-flag (CTF) tournament.',
    apply_link: 'https://unisync.edu/events',
    deadlineDays: 3,
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'Venture Capital STEM Scholarship',
    company: 'Sequoia Capital',
    source: 'Foundit',
    category: 'scholarship',
    department: 'Computer Science & Engineering',
    location: 'Global / Remote',
    eligibility: 'Undergraduate STEM students with startup prototypes',
    skills: ['Entrepreneurship', 'Product Development', 'Software Architecture'],
    description: 'Sequoia Capital is awarding $10,000 grants to promising undergraduate student builders. Focuses on student projects that display high innovation potential, scalability, and technical excellence.',
    apply_link: 'https://sequoiacap.com',
    deadlineDays: 45,
    image_url: 'https://images.unsplash.com/photo-1579532561814-c1bc1de747c1?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'Full Stack Developer Drive',
    company: 'TCS',
    source: 'Naukri',
    category: 'drive',
    department: 'Computer Science & Engineering',
    location: 'Campus Placement Arena',
    eligibility: 'All graduating engineering students',
    skills: ['Java', 'SQL', 'HTML/CSS', 'JavaScript'],
    description: 'TCS Mega Placement Drive for System Engineers. Selection involves a coding test followed by technical and HR interview rounds. Topics include basic data structures, OOPs, SQL, and database concepts.',
    apply_link: 'https://tcs.com',
    deadlineDays: 2,
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'React Native Mobile Developer',
    company: 'Internshala Startup Incubator',
    source: 'Internshala',
    category: 'internship',
    department: 'Computer Science & Engineering',
    location: 'Remote',
    eligibility: 'College students with React Native projects',
    skills: ['React Native', 'React', 'TypeScript', 'Redux', 'APIs'],
    description: 'Incubated startup is looking for a mobile app development intern to take their prototype to production. Responsibilities include UI design integration, API testing, and state management configuration.',
    apply_link: 'https://internshala.com',
    deadlineDays: 10,
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=200'
  },
  {
    title: 'Manufacturing & Process Automation Engineer',
    company: 'Boeing',
    source: 'Company Career Pages',
    category: 'job',
    department: 'Mechanical Engineering',
    location: 'Chennai, India',
    eligibility: 'B.Tech/M.Tech Mechanical / Aerospace candidates',
    skills: ['CNC Programming', 'PLC Systems', 'Automation', 'Mechanical Drafting'],
    description: 'Boeing Chennai Aerospace division is hiring junior process engineers to manage assembly line automation, CNC calibration parameters, industrial PLC configurations, and stress analysis of wing flaps.',
    apply_link: 'https://boeing.com/careers',
    deadlineDays: 18,
    image_url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=200'
  }
];

/**
 * Runs the aggregator crawler job.
 * Computes embeddings and stores opportunities in PostgreSQL and the in-memory array.
 */
export async function runAggregator(): Promise<void> {
  console.log('SyncAI Aggregator: Running Opportunity Aggregation Engine job...');
  try {
    const opportunities: Opportunity[] = [];

    for (const t of OPPORTUNITY_TEMPLATES) {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + t.deadlineDays);

      const descriptionHashText = `${t.title} ${t.company} ${t.description}`;
      const embedding = await getEmbedding(descriptionHashText);

      const op: Opportunity = {
        id: `op-${t.company.toLowerCase()}-${t.category}-${Math.random().toString(36).substring(2, 6)}`,
        title: t.title,
        company: t.company,
        source: t.source,
        category: t.category,
        department: t.department,
        location: t.location,
        eligibility: t.eligibility,
        skills: t.skills,
        description: t.description,
        apply_link: t.apply_link,
        deadline: deadlineDate.toISOString(),
        image_url: t.image_url,
        embedding,
        created_at: new Date().toISOString()
      };

      opportunities.push(op);
    }

    // 1. Update In-Memory Database
    mockOpportunities = opportunities;
    console.log(`SyncAI Aggregator: In-memory opportunities refreshed (${mockOpportunities.length} entries).`);

    // 2. Persist to Supabase if configured
    if (supabase && isOpportunitiesTableAvailable) {
      console.log('SyncAI Aggregator: Uploading opportunities to Supabase...');
      // First clean up old entries to simulate fresh sync
      const { error: deleteError } = await supabase
        .from('opportunities')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

      if (deleteError) {
        console.warn('SyncAI Aggregator: Failed to clear old database opportunities:', deleteError.message);
      }

      // Format for Supabase opportunities table
      const dbRows = opportunities.map(o => ({
        title: o.title,
        company: o.company,
        source: o.source,
        category: o.category,
        department: o.department,
        location: o.location,
        eligibility: o.eligibility,
        skills: o.skills,
        description: o.description,
        apply_link: o.apply_link,
        deadline: o.deadline,
        image_url: o.image_url,
        embedding: o.embedding
      }));

      const { data, error } = await supabase
        .from('opportunities')
        .insert(dbRows)
        .select();

      if (error) {
        console.error('SyncAI Aggregator: Error inserting opportunities to Supabase:', error.message);
      } else {
        console.log(`SyncAI Aggregator: Successfully persisted ${data?.length || 0} opportunities to Supabase PG.`);
      }
    } else if (supabase) {
      console.log('SyncAI Aggregator: Supabase table not available. Skipping DB sync (running in local fallback in-memory mode).');
    }
  } catch (err) {
    console.error('SyncAI Aggregator: Critical error in aggregator crawl job:', err);
  }
}

/**
 * Initializes the background aggregation timer job.
 * Runs every 6 hours.
 */
export function initAggregatorScheduler(): void {
  // Run immediately on boot
  runAggregator();

  // Schedule every 6 Hours (6 * 60 * 60 * 1000 ms = 21600000 ms)
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  setInterval(() => {
    runAggregator();
  }, SIX_HOURS_MS);

  console.log('SyncAI Scheduler: 6-hour background scraping job initialized.');
}
