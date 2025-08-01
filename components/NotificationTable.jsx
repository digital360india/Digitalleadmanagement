import React from "react";

export default function NotificationTable({notification ,getDomainFromUrl}) {
  return (
    <div className="mt-2 text-[16px] grid grid-cols-2 text-gray-800 space-y-3">
      <p>
        <span className="font-medium ">Parent Name:</span> {notification.leadDetails.name}
      </p>
      <p>
        <span className="font-medium ">Email:</span> {notification.leadDetails.email}
      </p>
      <p>
        <span className="font-medium ">Phone:</span> {notification.leadDetails.phoneNumber}
      </p>
      <p>
        <span className="font-medium ">Alternate Number:</span>{" "}
        {notification.leadDetails.alternateNumber}
      </p>
      <p>
        <span className="font-medium ">Assigned To:</span> {notification.leadDetails.assignedTo}
      </p>
      <p>
        <span className="font-medium ">Assigned By:</span> {notification.leadDetails.assignedBy}
      </p>
      <p>
        <span className="font-medium ">Student Name:</span> {notification.leadDetails.parentName}
      </p>
      <p>
        <span className="font-medium ">Budget:</span> {notification.leadDetails.budget}
      </p>
      <p>
        <span className="font-medium ">URL:</span>{" "}
        {notification.leadDetails?.url ? (
          <a
            href={notification.leadDetails.url}
            className="text-blue-600 hover:underline"
          >
            {getDomainFromUrl(notification.leadDetails.url)}
          </a>
        ) : (
          "-"
        )}
      </p>
     
      <p>
        <span className="font-medium ">Seeking Class:</span> {notification.leadDetails.seekingClass}
      </p>
      <p>
        <span className="font-medium ">Board:</span> {notification.leadDetails.board}
      </p>
      <p>
        <span className="font-medium ">School Type:</span> {notification.leadDetails.schoolType}
      </p>
      <p>
        <span className="font-medium ">Type:</span> {notification.leadDetails.type}
      </p>
      <p>
        <span className="font-medium ">Source:</span> {notification.leadDetails.source}
      </p>
      <p>
        <span className="font-medium ">Date:</span> {notification.leadDetails.date}
      </p>
      <p>
        <span className="font-medium ">Location:</span> {notification.leadDetails.location}
      </p>
      <p>
        <span className="font-medium ">School:</span> {notification.leadDetails.school}
      </p>
      <p>
        <span className="font-medium ">Remark:</span> {notification.leadDetails.remark || "-"}
      </p>
      <p>
        <span className="font-medium ">Disposition:</span>{" "}
        {notification.leadDetails.disposition || "-"}
      </p>
    </div>
  );
}
