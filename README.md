# Aurora · Ionic Vue + Firebase

Aplicativo mobile-first feito com Ionic Vue, Vue 3, TypeScript, Vue Router e Capacitor. Inclui login, cadastro, recuperação de senha, boas-vindas, edição do perfil e foto em Base64 no Cloud Firestore.

## Requisitos

- Node.js 20 ou superior e npm.
- Um projeto Firebase com app Web.
- Para Android: Android Studio e Android SDK instalados.

## Configurar o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e registre um app Web.
2. Em **Authentication → Sign-in method**, habilite **E-mail/senha**.
3. Crie o banco Cloud Firestore. Este app não usa Firebase Storage.
4. Copie `.env.example` para `.env` e substitua os valores de exemplo pelos dados exibidos em **Configurações do projeto → Seus apps → Configuração do SDK** (API key, auth domain, project ID, sender ID e app ID). Não invente nem reutilize credenciais de outro projeto.
5. Publique as regras que estão em `firestore.rules`. Com Firebase CLI instalada e autenticada:

   ```sh
   firebase login
   firebase use SEU_PROJECT_ID
   firebase deploy --only firestore:rules
   ```

   Também é possível copiar o arquivo para **Firestore Database → Regras** no Console. As regras permitem que cada usuário veja e altere somente o próprio perfil e documento de foto, validando campos, tipo e tamanho.

6. Em **Authentication → Settings → Authorized domains**, inclua o domínio usado em produção.

A foto fica no documento `profilePhotos/{uid}` como uma URL Base64 (`data:image/...;base64,...`). O arquivo de origem deve ter até 700 KB, pois o Firestore limita cada documento a 1 MiB. A imagem fica em uma coleção separada do perfil para não aumentar o documento `users/{uid}`. A configuração do Firebase Web é incluída no cliente e não substitui as regras de segurança. Não coloque senhas ou chaves privadas no `.env`.

## Instalar e executar no navegador

```sh
npm install
npm run dev
```

O terminal mostrará o endereço local. A aplicação precisa das variáveis reais do `.env` para habilitar as ações Firebase.

## Verificações

```sh
npm run typecheck
npm run build
```

## Executar no Android

Adicione a plataforma Android uma vez e sincronize os arquivos Web:

```sh
npm run android:add
npm run android:sync
npm run android:open
```

No Android Studio, escolha um emulador ou dispositivo conectado e execute o app. A seleção de fotos usa o seletor de arquivos do navegador/WebView, então não requer plugin nativo adicional. Se mudar o `.env` ou o código Web, execute `npm run android:sync` novamente.

## Testar as funcionalidades

1. Abra `/register`, crie uma conta com nome, e-mail e senha de pelo menos seis caracteres; confira a validação de confirmação e os campos obrigatórios.
2. Após o cadastro, confirme que a tela de boas-vindas mostra os dados e sugere completar o perfil.
3. Em **Meu perfil**, informe nome, data de nascimento e nickname. Selecione uma imagem JPG, PNG ou WEBP de até 700 KB para conferir a prévia; salve e veja a atualização na tela inicial.
4. Saia da conta e tente abrir `/profile`: o app deve redirecionar para `/login`. Entre novamente e atualize a página para confirmar a restauração da sessão e do perfil.
5. Em `/reset-password`, envie o e-mail da conta e confira a caixa de entrada e spam.
6. Tente cadastrar novamente o mesmo e-mail e use senha incorreta no login para conferir as mensagens de erro.

O Firebase Console precisa estar configurado para que autenticação, Firestore e envio real de e-mail funcionem. As regras são fornecidas no projeto, mas precisam ser publicadas no seu projeto Firebase.
