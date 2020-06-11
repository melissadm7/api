<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**
     * Encoder des mots de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder){
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        $adminUser = new User();

        $adminUser->setFirstName('Jordan')
                ->setLastName('Berti')
                ->setEmail('berti@epse.be')
                ->setPassword($this->passwordEncoder->encodePassword($adminUser,'password'))
                ->setRoles(['ROLE_ADMIN']);

        $manager->persist($adminUser);        

        for($u=0; $u < 10; $u++){
            $chrono = 1;
            $user = new User();
            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName())
                ->setEmail($faker->email())
                ->setPassword($this->passwordEncoder->encodePassword($user,'password'));
            $manager->persist($user);  
            
            for($c=0; $c < mt_rand(5,20); $c++){
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName())
                    ->setCompany($faker->company())
                    ->setEmail($faker->email())
                    ->setUser($user);
                $manager->persist($customer);

                for($i = 0; $i < mt_rand(3,10); $i++){
                    $invoice = New Invoice();
                    $invoice->setAmount($faker->randomFloat(2,250,5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT','PAID','CANCELLED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono);
                    $chrono++;
                    $manager->persist($invoice);    
                }

            }

        }



        $manager->flush();
    }
}
