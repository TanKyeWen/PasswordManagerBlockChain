import subprocess

def run_command(command):
    subprocess.run(["bash", "-lc", command], check=True)

def main():
    # Run the command to start the server
    commands = [
        "npx hardhat node",
        "npm run deploy:local"
    ]

    for command in commands:
        try:
            run_command(command)
        except subprocess.CalledProcessError as e:
            print(f"An error occurred while executing '{command}': {e}")
            return
    
    print("Server started successfully.")

if __name__ == "__main__":
    main()