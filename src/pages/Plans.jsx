import React, { useState } from 'react';
import { PlanCard } from '../components/PlanCard';
import { UsernameModal } from '../components/UsernameModal';

export const Plans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 pt-3 pb-24 select-none">
      {/* Username Modal for changing accounts */}
      <UsernameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        redirectPath="/plans"
      />

      {/* Primary Verification Plan Flow */}
      <PlanCard onOpenUsernameModal={() => setIsModalOpen(true)} />
    </div>
  );
};

export default Plans;
