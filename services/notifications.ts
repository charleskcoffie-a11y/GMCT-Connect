export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.');
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Notification permission error:', e);
    return 'denied';
  }
};

export const showLocalNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      const n = new Notification(title, options);
      setTimeout(() => n.close(), 5000);
    } catch (e) {
      console.error('Notification display error:', e);
    }
  }
};

// Placeholder for future Web Push subscription (requires server-side).
export const subscribePush = async (): Promise<void> => {
  // Implement VAPID-based Web Push with a backend when ready.
  return;
};
