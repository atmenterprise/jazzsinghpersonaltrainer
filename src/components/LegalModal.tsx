import { X } from "lucide-react";

interface LegalModalProps {
  type: "privacy" | "disclaimer" | "faq" | null;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  // Render content conditionally based on type
  const renderContent = () => {
    switch (type) {
      case "disclaimer":
        return (
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-black block mb-2">
              Jaz BooM Personal Training
            </span>
            <h2 className="text-3xl font-display font-black text-white mb-6 uppercase tracking-tight">
              Disclaimer Statement
            </h2>
            <hr className="h-px bg-zinc-900 border-none mb-6" />

            <div className="space-y-6 text-zinc-400 text-sm leading-relaxed text-justify">
              <section className="space-y-3">
                <h3 className="font-display font-black text-white text-base uppercase tracking-wider">PHYSIQUE &amp; EXERCISE RECOMMENDATION</h3>
                <p>
                  Jaz BooM Personal Training strongly recommends that you consult your physician before starting any exercise or workout program. You must be in good physical and mental condition and able to participate in the exercises. You should be aware and understand that when participating in any exercises or exercise program, there is a possibility of physical injury.
                </p>
                <p>
                  If you engage in any workout, exercise or workout programme, you agree that you do so at your own risk, are voluntarily participating in these activities, assume all risk of injury to yourself, and agree to release and discharge Jaz from any and all risk of injury to yourself, and agree to release and discharge Jaz BooM Personal Training from any and all claims or causes of action, known or unknown, arising out of Jaz BooM Personal Training negligence.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-zinc-900">
                <h3 className="font-display font-black text-white text-base uppercase tracking-wider">IMAGE ATTRIBUTION DISCLAIMER</h3>
                <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider">Images from Unsplash</h4>
                <p>
                  All the images are used based under the free creative license terms and agreements of the unsplash website. The photos on Unsplash are free to use and can be used for most commercial, personal projects, and for editorial use. However, appropriate credits are provided as below:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Cover / Hero Page Image Credit:</strong> Photo by <a href="https://unsplash.com/@visualsbyroyalz?utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Anastase Maragos</a> on <a href="https://unsplash.com/photos/topless-man-in-black-shorts-sitting-on-black-and-silver-barbell-9dzWZQWZMdE" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Unsplash</a>
                  </li>
                  <li>
                    <strong>Nutrition Page Program Image Credit:</strong> Photo by <a href="https://unsplash.com/@fishmac?utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Vitalii Pavlyshynets</a> on <a href="https://unsplash.com/photos/assorted-fruits-and-vegetables-on-green-surface-kcRFW-Hje8Y" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Unsplash</a>
                  </li>
                </ul>

                <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider pt-3">Personal Website Images</h4>
                <p>
                  The images (other than that from Unsplash) are owned by Jaz BooM Personal Training and are NOT free for use in other websites, applications, or any third party softwares. Jaz BooM Personal Training holds the copyright license to use the images on their website.
                </p>

                <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider pt-3">Animated GIFs Credits</h4>
                <p>
                  All the GIFs animated images used in the website are credited to the Flaticon website, used under the free creative license usage. Animated icons created by Freepik - Flaticon.
                </p>
              </section>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-black block mb-2">
              Jaz BooM Personal Training
            </span>
            <h2 className="text-3xl font-display font-black text-white mb-6 uppercase tracking-tight">
              Privacy &amp; GDPR Policy
            </h2>
            <hr className="h-px bg-zinc-900 border-none mb-6" />

            <div className="space-y-6 text-zinc-400 text-sm leading-relaxed text-justify">
              <section className="space-y-3">
                <p>
                  This privacy policy sets out how Jaz BooM Personal Training uses and protects any information that you give us when you use this website. Jaz BooM Personal Training is committed to ensuring that your privacy is protected.
                </p>
                <p>
                  Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement. Jaz BooM Personal Training may change this policy from time to time by updating this page. This policy is effective from 1st January 2023.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-zinc-900">
                <h3 className="font-display font-black text-white text-base uppercase tracking-wider">WHAT WE COLLECT &amp; GATHER</h3>
                <p>We may collect the following information:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Name and job title</li>
                  <li>Contact information including email address</li>
                  <li>Demographic information such as postcode, preferences, and interests</li>
                  <li>Other information relevant to custom surveys and/or offers</li>
                </ul>
              </section>

              <section className="space-y-3 pt-4 border-t border-zinc-900">
                <h3 className="font-display font-black text-white text-base uppercase tracking-wider">INTERNAL RECORD KEEPING &amp; SECURITY</h3>
                <p>
                  We require this information to build and maintain the quality and integrity of the website, understand your needs, and provide a better service. We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-zinc-900">
                <h3 className="font-display font-black text-white text-base uppercase tracking-wider">HOW WE USE COOKIES</h3>
                <p>
                  A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. We use traffic log cookies to identify which pages are being used. This helps us analyse data about web page traffic and improve our website in order to tailor it to customer needs. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-zinc-900">
                <h3 className="font-display font-black text-white text-base uppercase tracking-wider">CONTROLLING YOUR PERSONAL DATA</h3>
                <p>
                  We will not sell, distribute, or lease your personal information to third parties unless we have your permission or are required to do so by law. You may request details of personal information which we hold about you under the Data Protection Act 1998 by emailing <strong className="text-white">jaz_personaltraining@yahoo.co.uk</strong>.
                </p>
              </section>
            </div>
          </div>
        );

      case "faq":
        return <FAQContent />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div 
        className="relative bg-zinc-950 border border-zinc-900 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-none shadow-2xl p-6 sm:p-10 scrollbar-thin scrollbar-thumb-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-black hover:bg-white transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="h-4 w-4" />
        </button>

        {renderContent()}

        {/* Modal footer Close */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-right">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-white hover:text-black text-black px-6 py-3.5 rounded-none font-display font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Collapsible FAQ Component using interactive React state
import { useState } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";

function FAQContent() {
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({
    0: true, // First item open by default
  });

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = [
    {
      question: "Do I need a gym membership for personal training?",
      answer: (
        <span>
          You must get a gym membership with{" "}
          <a
            href="https://www.thegymgroup.com/find-a-gym/east-london-gyms/london-ilford-pioneer-point/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline inline-flex items-center gap-0.5 font-bold"
          >
            The Gym Group Pioneer Point <ArrowUpRight className="h-3 w-3" />
          </a>{" "}
          which is a no contract £23.99 per month giving you 24 hours access to using top gym equipment. You can cancel with a month's notice or freeze your membership.
        </span>
      ),
    },
    {
      question: "What’s the difference between personal training and online training?",
      answer: "You will have everything a personal training client has available to them, however I will not physically or via video link be by your side when you are working out in the gym. We will regularly be checking in with each other on a weekly basis so that I can help you to continue making progress in reaching your goal.",
    },
    {
      question: "What does a typical personal training session involve?",
      answer: (
        <span className="space-y-3 block">
          <span>The first session includes discussing protocols from the health questionnaire you would have returned before we meet, I will talk you through your nutrition plan, taking your starting out photos, carry out an assessment of your movement through the warm-up and exercises.</span>
          <br className="block my-2" />
          <span>This will give me the information I need to develop your nutrition and training plan. After the designed programme has started, each 60min session will have a mini review of your progress after which you will be pushed through a challenging resistance training workout.</span>
          <br className="block my-2" />
          <span>You will be expected to learn the warmup routine so that you can take time a short while before the session to be prepared to begin allowing us to use every minute focusing on the workout routine.</span>
        </span>
      ),
    },
    {
      question: "Why is personal training important?",
      answer: (
        <span className="space-y-3 block">
          <span>Personal training helps you learn new exercises safely through close guidance from an expert. Although you could learn by trying yourself without the guidance, however it’s far safer and time effective to learn each movement properly from the beginning.</span>
          <br className="block my-2" />
          <span>By investing in Jaz BooM Personal Training, you have an opportunity to use my years of experience to achieve results faster which if attempting alone you would take a lot longer with lots of trial and error to achieve if possible.</span>
          <br className="block my-2" />
          <span>I will also have the knowledge to match the intensity to your abilities and provide you with an in-depth training experience that pushes you to the edge of your comfort zone.</span>
          <br className="block my-2" />
          <span>It is critical to have support and a sense of accountability to achieve success in health and fitness goals which a personal trainer can provide alongside the tools you need to do this which cannot be matched when training alone.</span>
        </span>
      ),
    },
    {
      question: "How long will I need a personal trainer?",
      answer: "The minimum term is 12 weeks where clients have reached their goals, but it is not unusual for clients to continue beyond 12 weeks to commit to their health and fitness. I do not run a quick results or high turnover business but every client who invests in their training does so because they see value in the continued progression, accountability, and ongoing support to maintain their results.",
    },
    {
      question: "Do I really need a personal trainer?",
      answer: "The answer is yes if you are serious about making a long-term investment in your health and fitness. As a personal trainer I am not there to just trade time on the gym floor for money, I will make it my personal goal to help you achieve yours. This is why I will be essential if you are committed to achieving positive, sustainable lifestyle changes and this may involve in telling you what you need to hear instead of what you would like to hear. Training with me will not be a quick fix, it will be a long-term commitment to your health, fitness and wellbeing which will provide you knowledge for life.",
    },
    {
      question: "How many times a week should I train with you?",
      answer: "The frequency will depend on your lifestyle, budget, and preferences, but most of my clients train up to three times but have the option to go up to four sessions a week which all allow to maximise progression with effective recovery.",
    },
    {
      question: "What does a Nutritionist do?",
      answer: "A nutritionist is a broad title for a professional advising clients on nutrition and its effects on them. They help clients alter their diet to promote a healthier lifestyle and eating habits. Nutritionists teach people new, realistic, and sustainable ways to eat and understand food. So, if you regularly don’t feel well or have certain medical conditions like Diabetes, High Cholesterol and High Blood Pressure, you may find it helpful to speak with a Nutritionist.",
    },
    {
      question: "Will I receive advice on my nutrition including supplements while training?",
      answer: "You will receive a nutrition and supplement plan which takes into consideration your lifestyle, goal, and preferences. The time you spend training is only a small part compared to the 165 hours in the week but just as important and the foundation of your results. I will develop a sustainable plan for you to follow depending on your body composition and goal. It will show the importance of not eating saturated fatty foods and processed foods, but instead focusing on quality protein, carbs, fibre, and healthy fats. This will be a big deal for health benefits and how you look and feel at the end of your training. You will complete a health questionnaire which will give me the information about your goals, lifestyle, conditions, medications, symptoms, and current diet set up so that I can use it to create your plan. You will also keep a weekly activity and food diary so that I can make amendments when required to for your continued progress.",
    }
  ];

  return (
    <div>
      <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-black block mb-2">
        FAQ Center
      </span>
      <h2 className="text-3xl font-display font-black text-white mb-2 uppercase tracking-tight">
        Frequently Asked Questions
      </h2>
      <p className="text-zinc-500 text-xs mb-6 max-w-2xl">
        Select a question below to reveal in-depth explanations on personal training mechanics, nutrition consulting, program timelines, and membership expectations.
      </p>
      <hr className="h-px bg-zinc-950 border-none mb-6" />

      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = !!openIndexes[index];
          return (
            <div 
              key={index} 
              className="border border-zinc-900 bg-[#0c0c0e] hover:border-zinc-800 transition-all duration-200"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 select-none"
              >
                <span className="font-display font-bold text-white text-sm sm:text-base tracking-wide md:tracking-normal hover:text-amber-500 transition-colors">
                  {item.question}
                </span>
                <span className="shrink-0 bg-zinc-900 border border-zinc-800 p-1.5 text-amber-500">
                  {isOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
                </span>
              </button>
              
              {isOpen && (
                <div className="px-5 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-900/40 pt-4 bg-[#0a0a0c]/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
