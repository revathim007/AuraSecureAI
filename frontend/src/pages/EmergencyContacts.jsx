import React from 'react';
import { Phone, Shield, Flame, Ambulance, Info, Siren, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const EmergencyContacts = () => {
  const navigate = useNavigate();

  const emergencyNumbers = [
    {
      title: 'National Emergency Number',
      number: '112',
      description: 'Single emergency number for all services (Police, Fire, Ambulance)',
      icon: <Siren className="text-red-500" size={32} />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100'
    },
    {
      title: 'Police',
      number: '100',
      description: 'Standard police emergency line for law enforcement assistance',
      icon: <Shield className="text-blue-500" size={32} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Fire Station',
      number: '101',
      description: 'Immediate fire brigade assistance for fire-related emergencies',
      icon: <Flame className="text-orange-500" size={32} />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100'
    },
    {
      title: 'Ambulance',
      number: '102 / 108',
      description: 'Emergency medical services and ambulance transport',
      icon: <Ambulance className="text-green-500" size={32} />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100'
    },
    {
      title: 'Women Helpline',
      number: '1091 / 181',
      description: 'Specialized assistance and support for women in distress',
      icon: <AlertCircle className="text-pink-500" size={32} />,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-100'
    },
    {
      title: 'Disaster Management',
      number: '108',
      description: 'Assistance for natural disasters and large-scale emergencies',
      icon: <Info className="text-purple-500" size={32} />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/20 shadow-lg">
          <Phone size={40} className="text-red-600 animate-pulse" />
        </div>
        <h1 className="text-5xl font-black text-gray-800 tracking-tight">Indian Emergency Contacts</h1>
        <p className="text-gray-500 font-medium text-xl max-w-2xl mx-auto">
          Immediate access to national emergency services. Stay safe and alert during environmental hazards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyNumbers.map((contact, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-[2.5rem] border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center space-y-4 ${contact.bgColor} ${contact.borderColor}`}
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
              {contact.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-800">{contact.title}</h3>
              <p className="text-sm text-gray-500 font-medium px-4">{contact.description}</p>
            </div>
            <a 
              href={`tel:${contact.number.split(' / ')[0]}`}
              className="w-full py-4 bg-white text-gray-900 text-3xl font-black rounded-2xl border-2 border-gray-100 hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-3 group shadow-sm"
            >
              <Phone size={24} className="group-hover:animate-bounce" />
              {contact.number}
            </a>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/hazard-detection')}
          className="px-10 py-4 text-lg border-2"
        >
          Back to Hazard Detection
        </Button>
      </div>

      <div className="bg-blue-50 border-2 border-blue-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left shadow-soft">
        <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
          <Info size={32} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-blue-900">Emergency Protocol Reminder</h4>
          <p className="text-blue-700 font-medium">
            In case of a detected hazard, evacuate the area immediately before calling for help. Provide your precise location and the nature of the emergency to the operator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
