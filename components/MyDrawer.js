import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";


export default function MyDrawer({ title, isOpen, onClose,children }) {
 
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
