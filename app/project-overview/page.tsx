// プロジェクト概要
const ProjectOverview = ({ project, setProject }) => {
  const handleInputChange = (field, value) => {
    setProject(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">プロジェクト概要</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">プロジェクト名</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">会社名</label>
          <input
            type="text"
            value={project.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">税抜金額</label>
          <input
            type="number"
            value={project.amountExcludingTax}
            onChange={(e) => handleInputChange('amountExcludingTax', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">税込金額</label>
          <input
            type="number"
            value={project.amountIncludingTax}
            onChange={(e) => handleInputChange('amountIncludingTax', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">期間</label>
          <input
            type="text"
            value={project.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
