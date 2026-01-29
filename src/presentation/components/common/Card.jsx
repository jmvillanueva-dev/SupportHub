import React from "react";

/**
 * Card Component - Contenedor tipo tarjeta
 */
export default function Card({
  children,
  title,
  subtitle,
  action,
  className = "",
}) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-techcorp-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-techcorp-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
