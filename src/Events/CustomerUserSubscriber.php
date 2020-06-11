<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface{

    private $security;

    public function __construct(Security $security){
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE] // avant la validation du formulaire
        ];
    }

    public function setUserForCustomer(ViewEvent $event){
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();


        /* toujours vérifier que la requête concerne bien la création (POST) d'un Customer */
        if($customer instanceof Customer && $method === "POST"){

            // récupérer l'utilisateur actuellement connecté
            $user = $this->security->getUser(); /* on ajoute dans la class avec l'injection de dépendance la class Security qui permet de récupèrer des informations et notamment avec la fonction getUser l'utilisateur actuellement connecté */

            // assigner l'utilsateur au Customer qu'on est en train de créer
            $customer->setUser($user);
        }

    }
}