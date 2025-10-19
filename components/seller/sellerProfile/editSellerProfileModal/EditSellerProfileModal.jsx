import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Input } from "@heroui/input";
export default function EditSellerProfileModal({ isOpen, onOpenChange }) {
  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit profile
              </ModalHeader>
              <ModalBody>
                <Input label="Your name" type="text" />
                <Input label="Your designation" type="text" />
                <Input label="Your email" type="email" />
                <Input label="Your phone number" type="text" />
                <Input label="Your address" type="text" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
