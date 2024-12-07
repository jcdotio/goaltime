'use client';

export const VersionInfo = () => {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1';
  const gitHash = process.env.NEXT_PUBLIC_GIT_HASH?.slice(0, 7);
  const environment = process.env.NEXT_PUBLIC_APP_ENV || 'development';

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <span>v{version}</span>
      {gitHash && (
        <>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <code className="font-mono text-xs">{gitHash}</code>
        </>
      )}
      {environment !== 'production' && (
        <>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <span className="text-xs">{environment}</span>
        </>
      )}
    </div>
  );
};