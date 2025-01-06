import Link from 'next/link'
import Navbar from '../components/Navbar'
import { CodeBracketIcon, BeakerIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

const founders = [
  {
    name: 'Angelos',
    role: 'Co-Founder & Technical Lead',
    image: '/images/angelos.jpg', // Add founder images to public/images/
    description: 'AI enthusiast with expertise in machine learning and data analysis. Leads the development of our AI-powered analysis engine.',
    specialties: ['Machine Learning', 'Backend Development', 'Data Analysis'],
    linkedin: 'https://linkedin.com/in/angelos', // Add real LinkedIn URLs
    github: 'https://github.com/angelos'
  },
  {
    name: 'Tom',
    role: 'Co-Founder & Product Lead',
    image: '/images/tom.jpg',
    description: 'Full-stack developer with a passion for creating intuitive user experiences. Drives the product vision and development.',
    specialties: ['Full-Stack Development', 'UI/UX Design', 'Product Strategy'],
    linkedin: 'https://linkedin.com/in/tom',
    github: 'https://github.com/tom'
  }
]

const features = [
  {
    icon: CodeBracketIcon,
    title: 'Built by Developers for Developers',
    description: 'We understand the technical challenges and built solutions we would want to use ourselves.'
  },
  {
    icon: BeakerIcon,
    title: 'Data-Driven Approach',
    description: 'Our platform leverages advanced AI to provide accurate and actionable insights.'
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: 'Community Focused',
    description: 'We actively engage with our users to continuously improve and evolve our platform.'
  }
]

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                About KleinanzeigenGPT
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're building the future of iPhone price analysis with AI technology.
                Our mission is to provide transparent and accurate market insights.
              </p>
            </div>
          </div>
        </div>

        {/* Founders Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {founders.map((founder) => (
              <div key={founder.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  {/* Replace with actual founder images */}
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <span className="text-6xl">{founder.name[0]}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900">{founder.name}</h3>
                  <p className="text-blue-600 mb-4">{founder.role}</p>
                  <p className="text-gray-600 mb-6">{founder.description}</p>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {founder.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={founder.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex justify-center mb-4">
                    <feature.icon className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 